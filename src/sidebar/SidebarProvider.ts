import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private _snippetsPath: string;
  private sendSnippetCategoriesToWebView(language: string){
      const langDir = path.join(this._snippetsPath, language);
      console.log(langDir);
      const getCategories = (type: 'data_structures' | 'algorithms' | 'misc' | 'custom') => {
        const dirPath = path.join(langDir, type);
        console.log(dirPath);
        if (!fs.existsSync(dirPath)) return [];

        const categoryList =  fs.readdirSync(dirPath)
          .filter(file => file.endsWith('.json'))
          .map(file => path.basename(file, '.json'));
        console.log(categoryList);
        return categoryList;
      };
      const categories = {
        dataStructures: getCategories('data_structures'),
        algorithms: getCategories('algorithms'),
        misc: getCategories('misc'),
        custom: []
      };

      this.postMessage({
        command: 'loadSnippetCategories',
        language,
        categories
      });
  }
  public static readonly viewType = 'oneclicksidebar';

  // ✉️ Expose a safe message-sending method
  public postMessage(message: any) {
    this._view?.webview.postMessage(message);
  }

  
  constructor(private readonly _extensionUri: vscode.Uri) {
    this._snippetsPath = path.join(this._extensionUri.fsPath, 'snippets');
  }

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

    //Send all the snippet categories on load
    setTimeout(() => {
      this.sendSnippetCategoriesToWebView('cpp');
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
          break;
        }
        case 'resetAndExportSolution': {
          await vscode.commands.executeCommand('oneclick-cp.exportSolution', message);
          await vscode.commands.executeCommand('oneclick-cp.resetFiles', message.template);
          break;
        }
        case 'getSnippetCategories': {
          this.sendSnippetCategoriesToWebView(message.selectedLanguage);
          break;
        }
        case 'loadSnippetsFromCategory': {
          const { language, category, subCategory } = message;
          if (!language || !category || !subCategory) {
            console.error("Missing path parameters:", { language, category, subCategory });
            return;
          }

          const snippetJSONPath = path.join(this._snippetsPath, language, category, `${subCategory}.json`);
          console.log("Reading:", snippetJSONPath);
          const snippets = JSON.parse(fs.readFileSync(snippetJSONPath, 'utf-8'));
          this.postMessage({
            command: 'snippetsForCategory',
            category: message.category,
            subCategory: message.subCategory,
            snippets
          });
          break;
        }
        case 'insertSnippet': {
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            const snippet = new vscode.SnippetString(message.snippet);
            editor.insertSnippet(snippet); // 🔥 inserts at cursor
          }
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