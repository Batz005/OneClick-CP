import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { SidebarProvider } from './sidebar/SidebarProvider';
import { LanguageManager } from './languages/LanguageManager';
import { LanguageStrategy } from './languages/strategies';

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



function getTemplate(templateName: string): { [key: string]: string } {
  const config = vscode.workspace.getConfiguration('oneclick-cp');

  const allTemplates = config.get<{ [key: string]: { [file: string]: string } }>('templates') || {};
  return allTemplates[templateName] || {};
}

function registerResetCommand(languageManager: LanguageManager): vscode.Disposable {
  return vscode.commands.registerCommand('oneclick-cp.resetFiles', async (templateName?: string) => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('❌ No workspace folder found.');
      return;
    }

    const templateToUse = templateName ?? 'default';
    const templates = getTemplate(templateToUse);
    const inputContent = templates["input.txt"] ?? "";
    const outputContent = templates["output.txt"] ?? "";

    for (const folder of workspaceFolders) {
      if (folder.uri.path.includes('/Solutions/')) continue;

      // Detect language or default to C++
      let strategy = languageManager.getStrategy('cpp');
      for (const s of languageManager.getAllStrategies()) {
        try {
          await vscode.workspace.fs.stat(vscode.Uri.joinPath(folder.uri, s.mainFileName));
          strategy = s;
          break;
        } catch {}
      }

      const mainFile = vscode.Uri.joinPath(folder.uri, strategy.mainFileName);
      const inputTxt = vscode.Uri.joinPath(folder.uri, 'input.txt');
      const outputTxt = vscode.Uri.joinPath(folder.uri, 'output.txt');

      const mainContent = templates[strategy.mainFileName] ?? strategy.defaultContent;

      try {
        await vscode.workspace.fs.writeFile(mainFile, Buffer.from(mainContent, 'utf8'));
        await vscode.workspace.fs.writeFile(inputTxt, Buffer.from(inputContent, 'utf8'));
        await vscode.workspace.fs.writeFile(outputTxt, Buffer.from(outputContent, 'utf8'));
        vscode.window.showInformationMessage(`✅ Reset files in ${folder.name} (${strategy.languageId})`);
      } catch (err) {
        vscode.window.showErrorMessage(`❌ Failed to reset files: ${err}`);
      }
    }
  });
}

function registerSaveTemplateCommand(sidebarProvider: SidebarProvider, languageManager: LanguageManager): vscode.Disposable {
  return vscode.commands.registerCommand('oneclick-cp.saveTemplate', async (message: any) => {
    if (!message.templateName) {
      vscode.window.showWarningMessage('Template save cancelled (no name provided).');
      return;
    }

    const config = vscode.workspace.getConfiguration('oneclick-cp');
    const templates = config.get<{ [key: string]: { [file: string]: string } }>('templates') || {};

    if (templates[message.templateName]) {
      const confirm = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder: `Template "${message.templateName}" already exists. Overwrite?`,
      });
      if (confirm !== 'Yes') {
        vscode.window.showInformationMessage(`❌ Template save cancelled.`);
        return;
      }
    }

    const workspace = vscode.workspace.workspaceFolders?.[0];
    if (!workspace) {
      vscode.window.showErrorMessage("❌ No workspace open to read files.");
      return;
    }

    const root = workspace.uri;
    const editors = vscode.window.visibleTextEditors;
    const template: { [key: string]: string } = {};

    const getEditorText = (filename: string) =>
      editors.find(ed => ed.document.fileName.endsWith(filename))?.document.getText();

    if (message.includeMainCpp) {
      for (const strategy of languageManager.getAllStrategies()) {
        const filename = strategy.mainFileName;
        let content = getEditorText(filename);
        if (!content) {
          try {
            const buffer = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(root, filename));
            content = Buffer.from(buffer).toString('utf8');
          } catch {}
        }
        if (content) {
          template[filename] = content;
        }
      }
    }

    if (message.includeInputTxt) {
      let inputTxt = getEditorText('input.txt');
      if (!inputTxt) {
        try {
          const buffer = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(root, 'input.txt'));
          inputTxt = Buffer.from(buffer).toString('utf8');
        } catch {}
      }
      if (inputTxt) template["input.txt"] = inputTxt;
    }

    if (message.includeOutputTxt) {
      let outputTxt = getEditorText('output.txt');
      if (!outputTxt) {
        try {
          const buffer = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(root, 'output.txt'));
          outputTxt = Buffer.from(buffer).toString('utf8');
        } catch {}
      }
      if (outputTxt) template["output.txt"] = outputTxt;
    }

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

    const config = vscode.workspace.getConfiguration('oneclick-cp');
    const original = config.get<{ [key: string]: { [file: string]: string } }>('templates') || {};

    if (!original.hasOwnProperty(templateName)) {
      vscode.window.showWarningMessage(`⚠️ Template "${templateName}" does not exist.`);
      console.warn(`[DeleteTemplate] Attempted to delete non-existent template: "${templateName}"`);
      return;
    }

    const templates = { ...original };
    delete templates[templateName];

    await config.update('templates', templates, vscode.ConfigurationTarget.Global);

    sidebarProvider.postMessage({
      command: 'removeTemplateFromPicker',
      templateName: templateName
    });

    vscode.window.showInformationMessage(`🗑️ Template "${templateName}" deleted!`);
    console.log(`[DeleteTemplate] Deleted template: "${templateName}"`);
  });
}


function registerExportSolutionCommand(languageManager: LanguageManager): vscode.Disposable {
  return vscode.commands.registerCommand('oneclick-cp.exportSolution', async (message) => {
    const solutionName = await vscode.window.showInputBox({
      prompt: 'Enter a name for the exported solution folder',
      placeHolder: 'e.g., TwoSum, graphs_q3, Project1'
    });

    const workspace = vscode.workspace.workspaceFolders;
    if (!workspace) {
      vscode.window.showErrorMessage('❌ No workspace folder found.');
      return;
    }

    if (!solutionName) {
      vscode.window.showWarningMessage('⚠️ Solution export cancelled (no name provided).');
      return;
    }

    const rootUri = workspace[0].uri;
    const solutionsFolder = vscode.Uri.joinPath(rootUri, 'Solutions');
    try {
      await vscode.workspace.fs.stat(solutionsFolder);
    } catch {
      await vscode.workspace.fs.createDirectory(solutionsFolder);
    }

    const targetFolder = vscode.Uri.joinPath(solutionsFolder, solutionName);
    try {
      await vscode.workspace.fs.createDirectory(targetFolder);
    } catch { /* already exists */ }

    // Detect language
    let strategy = languageManager.getStrategy('cpp');
    for (const s of languageManager.getAllStrategies()) {
      try {
        await vscode.workspace.fs.stat(vscode.Uri.joinPath(rootUri, s.mainFileName));
        strategy = s;
        break;
      } catch {}
    }

    const targetMain = vscode.Uri.joinPath(targetFolder, strategy.mainFileName);
    const targetInputTxt = vscode.Uri.joinPath(targetFolder, "input.txt");
    const targetOutputTxt = vscode.Uri.joinPath(targetFolder, "output.txt");

    const mainUri = vscode.Uri.joinPath(rootUri, strategy.mainFileName);
    const inputUri = vscode.Uri.joinPath(rootUri, 'input.txt');
    const outputUri = vscode.Uri.joinPath(rootUri, 'output.txt');

    const editors = vscode.window.visibleTextEditors;
    const getEditorText = (filename: string) =>
      editors.find(ed => ed.document.fileName.endsWith(filename))?.document.getText();

    async function readFileIfNotOpen(uri: vscode.Uri): Promise<string> {
      try {
        const buf = await vscode.workspace.fs.readFile(uri);
        return Buffer.from(buf).toString('utf8');
      } catch {
        return '';
      }
    }

    let mainContent = getEditorText(strategy.mainFileName) ?? '';
    if (!mainContent) mainContent = await readFileIfNotOpen(mainUri);
    if (!mainContent) mainContent = strategy.defaultContent;

    let inputTxtContent = getEditorText('input.txt') ?? '';
    if (!inputTxtContent) inputTxtContent = await readFileIfNotOpen(inputUri);

    let outputTxtContent = getEditorText('output.txt') ?? '';
    if (!outputTxtContent) outputTxtContent = await readFileIfNotOpen(outputUri);

    try {
      await vscode.workspace.fs.writeFile(targetMain, Buffer.from(mainContent, 'utf8'));
      await vscode.workspace.fs.writeFile(targetInputTxt, Buffer.from(inputTxtContent, 'utf8'));
      await vscode.workspace.fs.writeFile(targetOutputTxt, Buffer.from(outputTxtContent, 'utf8'));

      vscode.window.showInformationMessage(`✅ Solution "${solutionName}" exported successfully.`);
    } catch (err) {
      vscode.window.showErrorMessage(`❌ Failed to export solution: ${err}`);
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
    
    // Detect language
    let strategy = languageManager.getStrategy('cpp');
    for (const s of languageManager.getAllStrategies()) {
      try {
        await vscode.workspace.fs.stat(vscode.Uri.joinPath(root, s.mainFileName));
        strategy = s;
        break;
      } catch {}
    }

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
  // small helpers mirrored from SidebarProvider
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

      // Notify sidebar to update UI
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