// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const defaultMainCpp = `#include <bits/stdc++.h>
using namespace std;

int main() {
    // your code here
    return 0;
}
`;

const defaultInputTxt = "";
const defaultOutputTxt = "";

function getActiveTemplate(): {[key: string]: string} {
		const config = vscode.workspace.getConfiguration('oneclick-cp');
		return config.get<{ [key: string]: string }>('defaultTemplates') || {};
}
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "oneclick-cp" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('oneclick-cp.resetFiles',async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders) {
			vscode.window.showErrorMessage('No workspace folder found.');
			return;
		}
		let status = 0;
		const templates = getActiveTemplate();

		const inputContent = templates["input.txt"] ?? defaultInputTxt;
		const outputContent = templates["output.txt"] ?? defaultOutputTxt;
		const mainCppContent = templates["main.cpp"] ?? defaultMainCpp;

		for (const folder of workspaceFolders) {
			const folderUri = folder.uri;
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
			

			vscode.window.showInformationMessage(`Reset main.cpp, input.txt and output.txt @${folderUri}`);
		}
			
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
