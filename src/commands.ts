import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { SidebarProvider } from './sidebar/SidebarProvider';
import { LanguageManager } from './languages/LanguageManager';
import { LanguageStrategy } from './languages/strategies';

type Templates = { [key: string]: { [file: string]: string } };

export function registerAllCommands(
    context: vscode.ExtensionContext,
    sidebarProvider: SidebarProvider,
    languageManager: LanguageManager
): vscode.Disposable[] {
  return [
    registerResetCommand(languageManager),
    registerSaveTemplateCommand(sidebarProvider, languageManager),
    registerDeleteTemplateCommand(sidebarProvider),
    registerExportSolutionCommand(languageManager),
    registerArrangeLayoutCommand(languageManager),
    registerCreateSnippetCommand(sidebarProvider)
  ];
}

// ---------------------------------------------------------------- helpers

/** Prefer the language of the active editor, then whichever main file exists, then C++. */
async function detectStrategy(languageManager: LanguageManager, root: vscode.Uri): Promise<LanguageStrategy> {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const fromEditor = languageManager.getAllStrategies().find(s => s.languageId === editor.document.languageId);
    if (fromEditor) {
      return fromEditor;
    }
  }
  for (const s of languageManager.getAllStrategies()) {
    try {
      await vscode.workspace.fs.stat(vscode.Uri.joinPath(root, s.mainFileName));
      return s;
    } catch { /* not present */ }
  }
  return languageManager.getStrategy('cpp');
}

/** Current text of a file: the open document (including unsaved edits, even in background tabs), then disk. */
async function readCurrent(uri: vscode.Uri): Promise<string | undefined> {
  const doc = vscode.workspace.textDocuments.find(d => d.uri.toString() === uri.toString());
  if (doc) {
    return doc.getText();
  }
  try {
    return Buffer.from(await vscode.workspace.fs.readFile(uri)).toString('utf8');
  } catch {
    return undefined;
  }
}

/** Write through the editor when the file is open, avoiding "file changed on disk" conflicts. */
async function writeContent(uri: vscode.Uri, content: string) {
  const doc = vscode.workspace.textDocuments.find(d => d.uri.toString() === uri.toString());
  if (doc) {
    const edit = new vscode.WorkspaceEdit();
    edit.replace(uri, new vscode.Range(0, 0, doc.lineCount, 0), content);
    await vscode.workspace.applyEdit(edit);
    await doc.save();
  } else {
    await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
  }
}

function getTemplate(templateName: string): { [key: string]: string } {
  const config = vscode.workspace.getConfiguration('oneclick-cp');
  const allTemplates = config.get<Templates>('templates') || {};
  return allTemplates[templateName] || {};
}

/**
 * Only the user's own templates. Writing back config.get() (defaults merged in) would copy
 * every built-in template into the user's settings.json.
 */
function userTemplates(): Templates {
  const config = vscode.workspace.getConfiguration('oneclick-cp');
  return { ...(config.inspect<Templates>('templates')?.globalValue || {}) };
}

// ---------------------------------------------------------------- commands

function registerResetCommand(languageManager: LanguageManager): vscode.Disposable {
  return vscode.commands.registerCommand('oneclick-cp.resetFiles', async (templateName?: string) => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('❌ No workspace folder found.');
      return;
    }

    const templateToUse = templateName ?? 'default';
    const templates = getTemplate(templateToUse);
    const inputContent = templates['input.txt'] ?? '';
    const outputContent = templates['output.txt'] ?? '';

    for (const folder of workspaceFolders) {
      if (folder.uri.path.includes('/Solutions/')) {
        continue;
      }

      const strategy = await detectStrategy(languageManager, folder.uri);
      const mainContent = templates[strategy.mainFileName] ?? strategy.defaultContent;

      try {
        await writeContent(vscode.Uri.joinPath(folder.uri, strategy.mainFileName), mainContent);
        await writeContent(vscode.Uri.joinPath(folder.uri, 'input.txt'), inputContent);
        await writeContent(vscode.Uri.joinPath(folder.uri, 'output.txt'), outputContent);
        vscode.window.showInformationMessage(`✅ Reset files in ${folder.name} (${strategy.languageId})`);
      } catch (err) {
        vscode.window.showErrorMessage(`❌ Failed to reset files: ${err}`);
      }
    }
  });
}

function registerSaveTemplateCommand(sidebarProvider: SidebarProvider, languageManager: LanguageManager): vscode.Disposable {
  return vscode.commands.registerCommand('oneclick-cp.saveTemplate', async (message: any) => {
    if (!message?.templateName) {
      vscode.window.showWarningMessage('Template save cancelled (no name provided).');
      return;
    }

    const config = vscode.workspace.getConfiguration('oneclick-cp');
    const existing = config.get<Templates>('templates') || {};
    if (existing[message.templateName]) {
      const confirm = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder: `Template "${message.templateName}" already exists. Overwrite?`,
      });
      if (confirm !== 'Yes') {
        vscode.window.showInformationMessage('❌ Template save cancelled.');
        return;
      }
    }

    const workspace = vscode.workspace.workspaceFolders?.[0];
    if (!workspace) {
      vscode.window.showErrorMessage('❌ No workspace open to read files.');
      return;
    }

    const root = workspace.uri;
    const template: { [key: string]: string } = {};

    if (message.includeMainCpp) {
      for (const strategy of languageManager.getAllStrategies()) {
        const content = await readCurrent(vscode.Uri.joinPath(root, strategy.mainFileName));
        if (content) {
          template[strategy.mainFileName] = content;
        }
      }
    }
    if (message.includeInputTxt) {
      const inputTxt = await readCurrent(vscode.Uri.joinPath(root, 'input.txt'));
      if (inputTxt) {
        template['input.txt'] = inputTxt;
      }
    }
    if (message.includeOutputTxt) {
      const outputTxt = await readCurrent(vscode.Uri.joinPath(root, 'output.txt'));
      if (outputTxt) {
        template['output.txt'] = outputTxt;
      }
    }

    const templates = userTemplates();
    templates[message.templateName] = template;
    await config.update('templates', templates, vscode.ConfigurationTarget.Global);

    sidebarProvider.postMessage({
      command: 'addTemplateToPicker',
      templateName: message.templateName,
    });

    vscode.window.showInformationMessage(`✅ Template "${message.templateName}" saved!`);
  });
}

function registerDeleteTemplateCommand(sidebarProvider: SidebarProvider): vscode.Disposable {
  return vscode.commands.registerCommand('oneclick-cp.deleteTemplate', async (templateName?: string) => {
    if (!templateName) {
      vscode.window.showErrorMessage('❌ No template name provided for deletion.');
      return;
    }

    const templates = userTemplates();
    if (!Object.prototype.hasOwnProperty.call(templates, templateName)) {
      vscode.window.showWarningMessage(`⚠️ Template "${templateName}" does not exist.`);
      return;
    }

    delete templates[templateName];
    await vscode.workspace.getConfiguration('oneclick-cp').update('templates', templates, vscode.ConfigurationTarget.Global);

    sidebarProvider.postMessage({
      command: 'removeTemplateFromPicker',
      templateName: templateName
    });

    vscode.window.showInformationMessage(`🗑️ Template "${templateName}" deleted!`);
  });
}

/** Resolves to true only when the solution was actually exported. */
function registerExportSolutionCommand(languageManager: LanguageManager): vscode.Disposable {
  return vscode.commands.registerCommand('oneclick-cp.exportSolution', async (): Promise<boolean> => {
    const workspace = vscode.workspace.workspaceFolders;
    if (!workspace) {
      vscode.window.showErrorMessage('❌ No workspace folder found.');
      return false;
    }

    const solutionName = (await vscode.window.showInputBox({
      prompt: 'Enter a name for the exported solution folder',
      placeHolder: 'e.g., TwoSum, graphs_q3, Project1'
    }))?.trim();

    if (!solutionName) {
      vscode.window.showWarningMessage('⚠️ Solution export cancelled (no name provided).');
      return false;
    }
    if (/[\\/]|\.\./.test(solutionName)) {
      vscode.window.showErrorMessage('❌ Use a plain folder name (no slashes or "..").');
      return false;
    }

    const rootUri = workspace[0].uri;
    const targetFolder = vscode.Uri.joinPath(rootUri, 'Solutions', solutionName);
    const strategy = await detectStrategy(languageManager, rootUri);

    try {
      await vscode.workspace.fs.createDirectory(targetFolder);
      const mainContent = (await readCurrent(vscode.Uri.joinPath(rootUri, strategy.mainFileName))) || strategy.defaultContent;
      const inputContent = (await readCurrent(vscode.Uri.joinPath(rootUri, 'input.txt'))) ?? '';
      const outputContent = (await readCurrent(vscode.Uri.joinPath(rootUri, 'output.txt'))) ?? '';

      await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(targetFolder, strategy.mainFileName), Buffer.from(mainContent, 'utf8'));
      await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(targetFolder, 'input.txt'), Buffer.from(inputContent, 'utf8'));
      await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(targetFolder, 'output.txt'), Buffer.from(outputContent, 'utf8'));

      vscode.window.showInformationMessage(`✅ Solution "${solutionName}" exported successfully.`);
      return true;
    } catch (err) {
      vscode.window.showErrorMessage(`❌ Failed to export solution: ${err}`);
      return false;
    }
  });
}

function registerArrangeLayoutCommand(languageManager: LanguageManager): vscode.Disposable {
  return vscode.commands.registerCommand('oneclick-cp.arrangeLayout', async () => {
    const wsFolders = vscode.workspace.workspaceFolders;
    if (!wsFolders) {
      vscode.window.showErrorMessage('No workspace folder found.');
      return;
    }

    const root = wsFolders[0].uri;
    const strategy = await detectStrategy(languageManager, root);

    const mainUri = vscode.Uri.joinPath(root, strategy.mainFileName);
    const inputUri = vscode.Uri.joinPath(root, 'input.txt');
    const outputUri = vscode.Uri.joinPath(root, 'output.txt');

    try {
      await vscode.commands.executeCommand('workbench.action.closeAllEditors');
      await vscode.commands.executeCommand('vscode.open', mainUri, { viewColumn: vscode.ViewColumn.One });
      await vscode.commands.executeCommand('vscode.open', inputUri, { viewColumn: vscode.ViewColumn.Two });
      await vscode.commands.executeCommand('workbench.action.focusSecondEditorGroup');
      await vscode.commands.executeCommand('workbench.action.splitEditorDown');
      await vscode.commands.executeCommand('vscode.open', outputUri, { viewColumn: vscode.ViewColumn.Three });

      vscode.window.showInformationMessage('🧩 Layout arranged successfully!');
    } catch (err) {
      vscode.window.showErrorMessage(`❌ Failed to arrange layout: ${err}`);
    }
  });
}

function registerCreateSnippetCommand(sidebarProvider: SidebarProvider): vscode.Disposable {
  const mapLangIdToKey = (langId?: string): string => {
    switch ((langId || '').toLowerCase()) {
      case 'cpp':
      case 'c++':
      case 'c':
        return 'cpp';
      case 'python':
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      case 'javascript':
      case 'js':
        return 'javascript';
      default:
        return 'cpp';
    }
  };
  const sanitizeName = (input: string): string =>
    (input || 'snippet')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_\-]/g, '_')
      .replace(/_+/g, '_');

  return vscode.commands.registerCommand('oneclick-cp.createSnippet', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found.');
      return;
    }

    const selection = editor.document.getText(editor.selection);
    if (!selection.trim()) {
      vscode.window.showErrorMessage('Please select some code to create a snippet.');
      return;
    }

    const rawName = await vscode.window.showInputBox({ prompt: 'Snippet Name / Key (used as object key & default prefix)' });
    if (!rawName) {
      vscode.window.showErrorMessage('Snippet name is required.');
      return;
    }
    const snippetKeyBase = sanitizeName(rawName);

    const description = await vscode.window.showInputBox({ prompt: 'Description (optional)' }) || '';
    const prefixInput = await vscode.window.showInputBox({ prompt: 'Prefix (optional, default = name)' });

    const rawSubcat = await vscode.window.showInputBox({ prompt: 'Enter subcategory (e.g., basics, strings, graphs). Stored under Custom → <subcategory>' }) || 'custom';
    const subcategory = sanitizeName(rawSubcat);

    const language = mapLangIdToKey(editor.document.languageId);

    // Path: <userSnippetsPath>/<language>/custom/<subcategory>.json
    const dir = path.join(sidebarProvider.userSnippetsPath, language, 'custom');
    const filePath = path.join(dir, `${subcategory}.json`);

    try {
      await fs.promises.mkdir(dir, { recursive: true });

      let jsonObj: Record<string, any> = {};
      if (fs.existsSync(filePath)) {
        try {
          jsonObj = JSON.parse(await fs.promises.readFile(filePath, 'utf-8')) || {};
        } catch {
          jsonObj = {};
        }
      }

      // Ensure unique key by auto-suffixing _2, _3, ...
      let finalKey = snippetKeyBase;
      let i = 2;
      while (Object.prototype.hasOwnProperty.call(jsonObj, finalKey)) {
        finalKey = `${snippetKeyBase}_${i++}`;
      }

      jsonObj[finalKey] = {
        prefix: prefixInput?.trim() || snippetKeyBase,
        description,
        body: selection.replace(/\r\n/g, '\n').split('\n')
      };

      await fs.promises.writeFile(filePath, JSON.stringify(jsonObj, null, 2), 'utf-8');

      vscode.window.showInformationMessage(`Snippet "${finalKey}" saved to Custom → ${subcategory}.`);

      sidebarProvider.postMessage({
        command: 'snippetSaved',
        language,
        category: 'custom',
        subcategory,
        key: finalKey
      });
      sidebarProvider.refreshSnippetCategories(language);
    } catch (err) {
      console.error('[Snippet Creation Error]:', err);
      vscode.window.showErrorMessage('Failed to save snippet. Check console for details.');
    }
  });
}
