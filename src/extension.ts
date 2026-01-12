// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SidebarProvider } from './sidebar/SidebarProvider';
import { registerAllCommands } from './commands';
import { LanguageManager } from './languages/LanguageManager';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "oneclick-cp" is now active!');

    const languageManager = new LanguageManager();
    const sidebarProvider = new SidebarProvider(context.extensionUri, languageManager, context);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarProvider.viewType, sidebarProvider)
	);
	console.log("✅ WebviewViewProvider registered for:", SidebarProvider.viewType);


	context.subscriptions.push(...registerAllCommands(context, sidebarProvider, languageManager));
	vscode.commands.getCommands(true).then(cmds => {
   		console.log('✅ Registered commands:', cmds);
	});
}

// This method is called when your extension is deactivated
export function deactivate() {}
