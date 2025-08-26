import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { SidebarProvider } from './sidebar/SidebarProvider';

export function registerAllCommands(
    context: vscode.ExtensionContext,
        sidebarProvider: SidebarProvider
): vscode.Disposable[] {
  return [
    registerResetCommand(),
    registerSaveTemplateCommand(sidebarProvider),
    registerDeleteTemplateCommand(sidebarProvider),
    registerExportSolutionCommand(),
    registerArrangeLayoutCommand(),
    registerCreateSnippetCommand(sidebarProvider)
  ];
}

const defaultMainCpp = `#include <bits/stdc++.h>
using namespace std;

int main() {
    // your code here
    return 0;
}
`;
const defaultInputTxt = "";
const defaultOutputTxt = "";

function getTemplate(templateName: string): { [key: string]: string } {
  const config = vscode.workspace.getConfiguration('oneclick-cp');

  const allTemplates = config.get<{ [key: string]: { [file: string]: string } }>('templates') || {};
  return allTemplates[templateName] || {};
}

function registerResetCommand(): vscode.Disposable {
  return vscode.commands.registerCommand('oneclick-cp.resetFiles', async (templateName?: string) => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('❌ No workspace folder found.');
      console.error('[Reset] No workspace folder found. Aborting resetFiles command.');
      return;
    }

    let status = 0;
    const templateToUse = templateName ?? 'default';
    const templates = getTemplate(templateToUse);
    const inputContent = templates["input.txt"] ?? defaultInputTxt;
    const outputContent = templates["output.txt"] ?? defaultOutputTxt;
    const mainCppContent = templates["main.cpp"] ?? defaultMainCpp;

    console.log(`[Reset] Selected template: ${templateToUse}`);
    console.log(`[Reset] Templates loaded: main.cpp=${!!templates["main.cpp"]}, input.txt=${!!templates["input.txt"]}, output.txt=${!!templates["output.txt"]}`);
    if (!templates["main.cpp"] || !templates["input.txt"] || !templates["output.txt"]) {
      console.log(`[Reset] One or more template files missing for "${templateToUse}". Using defaults for missing files.`);
    }

    for (const folder of workspaceFolders) {
      const folderUri = folder.uri;
      if (folderUri.path.includes('/Solutions/')) {
        console.log(`[Reset] Skipping Solutions folder: ${folderUri.fsPath}`);
        continue;
      }
      const mainCpp = vscode.Uri.joinPath(folderUri, 'main.cpp');
      const inputTxt = vscode.Uri.joinPath(folderUri, 'input.txt');
      const outputTxt = vscode.Uri.joinPath(folderUri, 'output.txt');

      try {
        await vscode.workspace.fs.stat(mainCpp);
        await vscode.workspace.fs.stat(inputTxt);
        await vscode.workspace.fs.stat(outputTxt);

        vscode.window.showInformationMessage(`📂 Found folder: ${folder.name} with all 3 files.`);
        try {
          await vscode.workspace.fs.writeFile(mainCpp, Buffer.from(mainCppContent, 'utf8'));
          await vscode.workspace.fs.writeFile(inputTxt, Buffer.from(inputContent, 'utf8'));
          await vscode.workspace.fs.writeFile(outputTxt, Buffer.from(outputContent, 'utf8'));
          vscode.window.showInformationMessage(`✅ Reset files in folder: ${folderUri.fsPath}`);
          console.log(`[Reset] Successfully reset files in folder: ${folderUri.fsPath} using template: ${templateToUse}`);
        } catch (err) {
          vscode.window.showErrorMessage(`❌ Failed to write files in folder: ${folderUri.fsPath} – ${err}`);
          console.error(`[Reset] Failed to write files in folder: ${folderUri.fsPath} –`, err);
        }
        status = 1;
        break;
      } catch (statErr) {
        console.log(`[Reset] Skipping folder (missing files): ${folderUri.fsPath}`);
      }
    }

    if (status === 0) {
      vscode.window.showWarningMessage('⚠️ No folder had all 3 files — fallback triggered.');
      const folderUri = workspaceFolders[0].uri;
      const mainCpp = vscode.Uri.joinPath(folderUri, "main.cpp");
      const inputTxt = vscode.Uri.joinPath(folderUri, "input.txt");
      const outputTxt = vscode.Uri.joinPath(folderUri, "output.txt");
      try {
        await vscode.workspace.fs.writeFile(mainCpp, Buffer.from(mainCppContent, 'utf8'));
        await vscode.workspace.fs.writeFile(inputTxt, Buffer.from(inputContent, 'utf8'));
        await vscode.workspace.fs.writeFile(outputTxt, Buffer.from(outputContent, 'utf8'));
        vscode.window.showInformationMessage(`✅ Reset files in fallback folder: ${folderUri.fsPath}`);
        console.log(`[Reset] Fallback: Reset files in folder: ${folderUri.fsPath} using template: ${templateToUse}`);
        if (!templates["main.cpp"] || !templates["input.txt"] || !templates["output.txt"]) {
          console.log(`[Reset] Fallback used default templates for missing files in folder: ${folderUri.fsPath}`);
        }
      } catch (err) {
        vscode.window.showErrorMessage(`❌ Fallback write failed: ${err}`);
        console.error(`[Reset] Fallback write failed in folder: ${folderUri.fsPath} –`, err);
      }
    }
  });
}

function registerSaveTemplateCommand(sidebarProvider: SidebarProvider): vscode.Disposable {
  return vscode.commands.registerCommand('oneclick-cp.saveTemplate', async (message: any) => {
    if (!message.templateName) {
      vscode.window.showWarningMessage('Template save cancelled (no name provided).');
      return;
    }

    const config = vscode.workspace.getConfiguration('oneclick-cp');
    const templates = config.get<{ [key: string]: { [file: string]: string } }>('templates') || {};

    // Collision check
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
    const mainUri = vscode.Uri.joinPath(root, 'main.cpp');
    const inputUri = vscode.Uri.joinPath(root, 'input.txt');
    const outputUri = vscode.Uri.joinPath(root, 'output.txt');

    const editors = vscode.window.visibleTextEditors;
    let mainCpp = "", inputTxt = "", outputTxt = "";

    const getEditorText = (filename: string) =>
      editors.find(ed => ed.document.fileName.endsWith(filename))?.document.getText();

    if (message.includeMainCpp) {
      mainCpp = getEditorText('main.cpp') ?? '';
      if (!mainCpp) {
        try {
          const buffer = await vscode.workspace.fs.readFile(mainUri);
          mainCpp = Buffer.from(buffer).toString('utf8');
        } catch { console.warn(`⚠️ Couldn't read main.cpp from disk`); }
      }
    }

    if (message.includeInputTxt) {
      inputTxt = getEditorText('input.txt') ?? '';
      if (!inputTxt) {
        try {
          const buffer = await vscode.workspace.fs.readFile(inputUri);
          inputTxt = Buffer.from(buffer).toString('utf8');
        } catch { console.warn(`⚠️ Couldn't read input.txt from disk`); }
      }
    }

    if (message.includeOutputTxt) {
      outputTxt = getEditorText('output.txt') ?? '';
      if (!outputTxt) {
        try {
          const buffer = await vscode.workspace.fs.readFile(outputUri);
          outputTxt = Buffer.from(buffer).toString('utf8');
        } catch { console.warn(`⚠️ Couldn't read output.txt from disk`); }
      }
    }

    const template: { [key: string]: string } = {};
    if (message.includeMainCpp) template["main.cpp"] = mainCpp;
    if (message.includeInputTxt) template["input.txt"] = inputTxt;
    if (message.includeOutputTxt) template["output.txt"] = outputTxt;

    templates[message.templateName] = template;
    await config.update('templates', templates, vscode.ConfigurationTarget.Global);

    sidebarProvider.postMessage({
      command: 'addTemplateToPicker',
      templateName: message.templateName,
    });

    vscode.window.showInformationMessage(`✅ Template "${message.templateName}" saved!`);
    console.log(`[Template] Saved: "${message.templateName}"`);
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


function registerExportSolutionCommand(): vscode.Disposable {
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

    const targetMainCpp = vscode.Uri.joinPath(targetFolder, "main.cpp");
    const targetInputTxt = vscode.Uri.joinPath(targetFolder, "input.txt");
    const targetOutputTxt = vscode.Uri.joinPath(targetFolder, "output.txt");

    const root = workspace[0].uri;
    const mainUri = vscode.Uri.joinPath(root, 'main.cpp');
    const inputUri = vscode.Uri.joinPath(root, 'input.txt');
    const outputUri = vscode.Uri.joinPath(root, 'output.txt');

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

    let mainCppContent = getEditorText('main.cpp') ?? '';
    if (!mainCppContent) mainCppContent = await readFileIfNotOpen(mainUri);
    if (!mainCppContent) mainCppContent = defaultMainCpp;

    let inputTxtContent = getEditorText('input.txt') ?? '';
    if (!inputTxtContent) inputTxtContent = await readFileIfNotOpen(inputUri);

    let outputTxtContent = getEditorText('output.txt') ?? '';
    if (!outputTxtContent) outputTxtContent = await readFileIfNotOpen(outputUri);

    try {
      await vscode.workspace.fs.writeFile(targetMainCpp, Buffer.from(mainCppContent, 'utf8'));
      await vscode.workspace.fs.writeFile(targetInputTxt, Buffer.from(inputTxtContent, 'utf8'));
      await vscode.workspace.fs.writeFile(targetOutputTxt, Buffer.from(outputTxtContent, 'utf8'));

      vscode.window.showInformationMessage(`✅ Solution "${solutionName}" exported successfully.`);
      console.log(`[Export] Exported to: ${targetFolder.fsPath}`);
    } catch (err) {
      vscode.window.showErrorMessage(`❌ Failed to export solution: ${err}`);
      console.error(`[Export] Failed to write exported solution –`, err);
    }
  });
}

function registerArrangeLayoutCommand(): vscode.Disposable {
  return vscode.commands.registerCommand('oneclick-cp.arrangeLayout', async () => {
    const wsFolders = vscode.workspace.workspaceFolders;
    if (!wsFolders) {
      vscode.window.showErrorMessage('No workspace folder found.');
      console.error('[Layout] No workspace folder found.');
      return;
    }

    const root = wsFolders[0].uri;
    const mainUri = vscode.Uri.joinPath(root, 'main.cpp');
    const inputUri = vscode.Uri.joinPath(root, 'input.txt');
    const outputUri = vscode.Uri.joinPath(root, 'output.txt');

    try {
      // Close all existing editors to avoid duplicate splits and tabs
      await vscode.commands.executeCommand('workbench.action.closeAllEditors');
      console.log('[Layout] Closed all editors to ensure no duplicate splits/tabs.');

      // Open main.cpp in column 1 (left)
      await vscode.commands.executeCommand('vscode.open', mainUri, { viewColumn: vscode.ViewColumn.One });
      console.log('[Layout] Opened main.cpp in ViewColumn.One');

      // Open input.txt in column 2 (right)
      await vscode.commands.executeCommand('vscode.open', inputUri, { viewColumn: vscode.ViewColumn.Two });
      console.log('[Layout] Opened input.txt in ViewColumn.Two');

      // Split editor down and open output.txt in the bottom half of column 2
      await vscode.commands.executeCommand('workbench.action.focusSecondEditorGroup');
      await vscode.commands.executeCommand('workbench.action.splitEditorDown');
      await vscode.commands.executeCommand('vscode.open', outputUri, { viewColumn: vscode.ViewColumn.Three });
      console.log('[Layout] Opened output.txt in ViewColumn.Three (split below)');

      vscode.window.showInformationMessage('🧩 Layout arranged successfully!');
    } catch (err) {
      vscode.window.showErrorMessage(`❌ Failed to arrange layout: ${err}`);
      console.error('[Layout] Error arranging layout:', err);
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