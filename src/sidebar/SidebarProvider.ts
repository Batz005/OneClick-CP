import * as vscode from 'vscode';
import * as fs from 'fs';

export class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  public static readonly viewType = 'oneclicksidebar';

  // ✉️ Expose a safe message-sending method
  public postMessage(message: any) {
    this._view?.webview.postMessage(message);
  }

  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

    // Send all templates to webview after load
    setTimeout(() => {
      const config = vscode.workspace.getConfiguration('oneclick-cp');
      const templates = config.get<{ [key: string]: { [file: string]: string } }>('templates') || {};
      webviewView.webview.postMessage({
        command: 'initTemplates',
        templates: Object.keys(templates)
      });
    }, 100);

    webviewView.webview.onDidReceiveMessage(async message => {
      console.log("Received message:", message); // Debug
      switch (message.command) {
        case 'resetFiles':
          vscode.commands.executeCommand('oneclick-cp.resetFiles', message.template);
          break;
        case 'saveTemplate': {
          vscode.commands.executeCommand('oneclick-cp.saveTemplate', message);
          break;
        }
        case 'deleteTemplate': {
          vscode.commands.executeCommand('oneclick-cp.deleteTemplate', message.templateName);
          break;
        }
        case 'arrangeLayout': {
          vscode.commands.executeCommand('oneclick-cp.arrangeLayout');
          break;
        }
        case 'exportSolution': {
          vscode.commands.executeCommand('oneclick-cp.exportSolution', message);
        }
        case 'resetAndExportSolution': {
          await vscode.commands.executeCommand('oneclick-cp.exportSolution', message);
          await vscode.commands.executeCommand('oneclick-cp.resetFiles', message.template);
        }
      }
    });
  }

  getHtmlForWebview(webview: vscode.Webview): string {
    const htmlPath = vscode.Uri.joinPath(this._extensionUri, 'resources', 'sidebar', 'sidebar.html');
    let html = fs.readFileSync(htmlPath.fsPath, 'utf8');

    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'resources', 'sidebar', 'sidebar.css')
    );
    const logoUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'resources', 'OneClick_CP_LOGO.svg')
    );

    const bkLogoUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'resources', 'BK_LOGO.svg')
    );

    html = html.replace('{{styleUri}}', styleUri.toString());
    html = html.replace('{{logoUri}}', logoUri.toString());
    html = html.replace('{{bkLogoUri}}', bkLogoUri.toString());

    return html;
  }
}