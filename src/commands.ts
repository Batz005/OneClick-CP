import * as vscode from 'vscode';
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
    registerArrangeLayoutCommand()
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
            vscode.window.showErrorMessage('No workspace folder found.');
            return;
        }
        let status = 0;
        const templates = getTemplate(templateName ?? 'default');
        console.log(`${templates}`);
        const inputContent = templates["input.txt"] ?? defaultInputTxt;
        const outputContent = templates["output.txt"] ?? defaultOutputTxt;
        const mainCppContent = templates["main.cpp"] ?? defaultMainCpp;
  
        for (const folder of workspaceFolders) {
            const folderUri = folder.uri;
            if (folderUri.path.includes('/Solutions/')) {
                continue;
            }
            const mainCpp = vscode.Uri.joinPath(folderUri, 'main.cpp');
            const inputTxt = vscode.Uri.joinPath(folderUri, 'input.txt');
            const outputTxt = vscode.Uri.joinPath(folderUri, 'output.txt');
            
            try {
                await vscode.workspace.fs.stat(mainCpp);
                await vscode.workspace.fs.stat(inputTxt);
                await vscode.workspace.fs.stat(outputTxt);
  
                vscode.window.showInformationMessage(`Found folder: ${folder.name} with main.cpp, input.txt, and output.txt`);
                try {
                    await vscode.workspace.fs.writeFile(mainCpp, Buffer.from(mainCppContent, 'utf8'));
                    await vscode.workspace.fs.writeFile(inputTxt, Buffer.from(inputContent, 'utf8'));
                    await vscode.workspace.fs.writeFile(outputTxt, Buffer.from(outputContent, 'utf8'));
                }
                catch (err){
                    vscode.window.showErrorMessage(`❌ Failed to reset files: ${err}`);
                }
                status = 1;
                vscode.window.showInformationMessage(`Reset main.cpp, input.txt and output.txt @${folderUri}`);
                break;
            } catch {
                // One or more files do not exist in this folder, continue searching
            }
        }
  
        if(status === 0){
            vscode.window.showWarningMessage('No folder found with main.cpp, input.txt, and output.txt');
            const folderUri = workspaceFolders[0].uri;
            const mainCpp = vscode.Uri.joinPath(folderUri, "main.cpp");
            const inputTxt = vscode.Uri.joinPath(folderUri, "input.txt");
            const outputTxt = vscode.Uri.joinPath(folderUri, "output.txt");
            try{
                await vscode.workspace.fs.writeFile(mainCpp, Buffer.from(mainCppContent, 'utf8'));
                await vscode.workspace.fs.writeFile(inputTxt, Buffer.from(inputContent, 'utf8'));
                await vscode.workspace.fs.writeFile(outputTxt, Buffer.from(outputContent, 'utf8'));
            }
            catch (err){
                vscode.window.showErrorMessage(`❌ Failed to reset files: ${err}`);
            }
            
  
            vscode.window.showInformationMessage(`Reset main.cpp, input.txt and output.txt @${folderUri} using template: ${templateName ?? 'default'}`);
        }
            
    });
}
// TODO(@bharath): Improve this by searching workspace for main.cpp, input.txt, output.txt if not open
function registerSaveTemplateCommand(sidebarProvider: SidebarProvider): vscode.Disposable {
    return vscode.commands.registerCommand('oneclick-cp.saveTemplate', async (message: any) => {
        if (!message.templateName) {
            vscode.window.showWarningMessage('Template save cancelled (no name provided).');
            return;
        }
        // Get content from open editors or empty string
        const editors = vscode.window.visibleTextEditors;
        let mainCpp = "", inputTxt = "", outputTxt = "";
        for (const ed of editors) {
        if (ed.document.fileName.endsWith('main.cpp')) {mainCpp = ed.document.getText();}
        if (ed.document.fileName.endsWith('input.txt')) {inputTxt = ed.document.getText();}
        if (ed.document.fileName.endsWith('output.txt')) {outputTxt = ed.document.getText();}
        }
        // Only include selected files
        const template: { [key: string]: string } = {};
        if (message.includeMainCpp) {template["main.cpp"] = mainCpp;}
        if (message.includeInputTxt) {template["input.txt"] = inputTxt;}
        if (message.includeOutputTxt) {template["output.txt"] = outputTxt;}

        // Save to global config
        const config = vscode.workspace.getConfiguration('oneclick-cp');
        const templates = config.get<{ [key: string]: { [file: string]: string } }>('templates') || {};
        templates[message.templateName] = template;
        await config.update('templates', templates, vscode.ConfigurationTarget.Global);

        // Notify webview to update picker
        sidebarProvider.postMessage({
        command: 'addTemplateToPicker',
        templateName: message.templateName
        });

        vscode.window.showInformationMessage(`✅ Template "${message.templateName}" saved!`);

  
        // Optionally, prompt for a category or tag (structure only, not used)
        // const category = await vscode.window.showInputBox({
        // 	prompt: 'Enter a category or tag for this template (optional)',
        // 	placeHolder: 'e.g., graphs, dp, math',
        // 	value: ''
        // });
  
    });
}

function registerDeleteTemplateCommand(sidebarProvider: SidebarProvider): vscode.Disposable {
  return vscode.commands.registerCommand('oneclick-cp.deleteTemplate', async (templateName?: string) => {
    const config = vscode.workspace.getConfiguration('oneclick-cp');
              // Clone the templates object to avoid mutating the proxy
              const original = config.get<{ [key: string]: { [file: string]: string } }>('templates') || {};
              const templates = { ...original };
              delete templates[templateName?? ''];
              await config.update('templates', templates, vscode.ConfigurationTarget.Global);
              sidebarProvider.postMessage({
                command: 'removeTemplateFromPicker',
                templateName: templateName
              });
              vscode.window.showInformationMessage(`🗑️ Template "${templateName}" deleted!`);
    
  });
}

//  TODO(@bharath): Improve this by searching workspace for main.cpp, input.txt, output.txt if not open
function registerExportSolutionCommand(): vscode.Disposable {
  return vscode.commands.registerCommand('oneclick-cp.exportSolution', async (message) => {
    const solutionName = await vscode.window.showInputBox({
        prompt: 'Enter a name for the exported solution folder',
        placeHolder: 'e.g., TwoSum, graphs_q3, Project1'
    });
    const workspace = vscode.workspace.workspaceFolders;
    if (!workspace) {
            vscode.window.showErrorMessage('No workspace folder found.');
            return;
    }
    if(!solutionName){
        vscode.window.showWarningMessage('Solution export cancelled (no name provided).');
            return;
    }
    const rootUri = workspace[0].uri;
    const solutionsFolder = vscode.Uri.joinPath(rootUri, 'Solutions');
    try {
        await vscode.workspace.fs.stat(solutionsFolder);
    } catch {
        await vscode.workspace.fs.createDirectory(solutionsFolder);
    }
    const targetFolder = vscode.Uri.joinPath(solutionsFolder, `${solutionName}`);


    const targetMainCpp = vscode.Uri.joinPath(targetFolder, "main.cpp");
    const targetInputTxt = vscode.Uri.joinPath(targetFolder, "input.txt");
    const targetOutputTxt = vscode.Uri.joinPath(targetFolder, "output.txt");

    // Get content from open editors or empty string
    const editors = vscode.window.visibleTextEditors;
    let mainCppContent = "", inputTxtContent = "", outputTxtContent = "";
    for (const ed of editors) {
        if (ed.document.fileName.endsWith('main.cpp')) {mainCppContent = ed.document.getText();}
        if (ed.document.fileName.endsWith('input.txt')) {inputTxtContent = ed.document.getText();}
        if (ed.document.fileName.endsWith('output.txt')) {outputTxtContent = ed.document.getText();}
    }
    
    try {
        await vscode.workspace.fs.writeFile(targetMainCpp, Buffer.from(mainCppContent, 'utf8'));
        await vscode.workspace.fs.writeFile(targetInputTxt, Buffer.from(inputTxtContent, 'utf8'));
        await vscode.workspace.fs.writeFile(targetOutputTxt, Buffer.from(outputTxtContent, 'utf8'));
    }
    catch (err){
        vscode.window.showErrorMessage(`❌ Failed to export files: ${err}`);
    }

  });
}

function registerArrangeLayoutCommand(): vscode.Disposable {
  return vscode.commands.registerCommand('oneclick-cp.arrangeLayout', async () => {
    const wsFolders = vscode.workspace.workspaceFolders;
    if (!wsFolders) {
        vscode.window.showErrorMessage('No workspace folder found.');
        return;
    }

    const root = wsFolders[0].uri;
    const mainUri = vscode.Uri.joinPath(root, 'main.cpp');
    const inputUri = vscode.Uri.joinPath(root, 'input.txt');
    const outputUri = vscode.Uri.joinPath(root, 'output.txt');

    // Open main.cpp in column 1 (left)
    await vscode.commands.executeCommand('vscode.open', mainUri, { viewColumn: vscode.ViewColumn.One });

    // Open input.txt in column 2 (right)
    await vscode.commands.executeCommand('vscode.open', inputUri, { viewColumn: vscode.ViewColumn.Two });

    // Split editor down and open output.txt in the bottom half of column 2
    await vscode.commands.executeCommand('workbench.action.focusSecondEditorGroup');
    await vscode.commands.executeCommand('workbench.action.splitEditorDown');
    await vscode.commands.executeCommand('vscode.open', outputUri, { viewColumn: vscode.ViewColumn.Three });
  });
}

  