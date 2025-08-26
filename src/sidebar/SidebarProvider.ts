/* eslint-disable curly */
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class SidebarProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private _builtinSnippetsPath: string; // shipped with the extension (read-only)
  public userSnippetsPath: string;    // in user storage (persists across updates)

  private ensureDir(p: string) {
    try { fs.mkdirSync(p, { recursive: true }); } catch { /* ignore */ }
  }

  private readJsonIfExists<T = any>(filePath: string): T | {} {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure object
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
      }
    } catch { /* ignore */ }
    return {};
  }

  private previewDecoration?: vscode.TextEditorDecorationType;

  private sendSnippetCategoriesToWebView(language: string){
    const collect = (root: string, type: 'data_structures' | 'algorithms' | 'misc' | 'custom') => {
      const dirPath = path.join(root, language, type);
      if (!fs.existsSync(dirPath)) return [] as string[];
      return fs.readdirSync(dirPath)
        .filter(file => file.endsWith('.json'))
        .map(file => path.basename(file, '.json'));
    };

    const mergeCats = (type: 'data_structures' | 'algorithms' | 'misc' | 'custom') => {
      const merged = new Set<string>([
        ...collect(this._builtinSnippetsPath, type),
        ...collect(this.userSnippetsPath, type),
      ]);
      return Array.from(merged).sort();
    };
    
    const dataStructures = mergeCats('data_structures');
    const algorithms = mergeCats('algorithms');
    const misc = mergeCats('misc');
    const custom = mergeCats('custom');
    
    const categories: { [key: string]: string[] } = {};
    if (dataStructures.length) 
      categories.dataStructures = dataStructures;
    else
      console.warn(`[Snippets] No data structure snippets found for ${language}`);
    
    if (algorithms.length) 
      categories.algorithms = algorithms;
    else
      console.warn(`[Snippets] No algorithm snippets found for ${language}`);
    
    if (misc.length) 
      categories.misc = misc;
    else
      console.warn(`[Snippets] No misc snippets found for ${language}`);

    if (custom.length) 
      categories.custom = custom;
    else
      console.warn(`[Snippets] No custom snippets found for ${language}`);

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

  private mapLangIdToKey(langId?: string, fallback?: string): string {
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
        return fallback || 'cpp';
    }
  }

  // Add just above or below resolveWebviewView()
  public refreshSnippetCategories(language?: string) {
    const langKey = this.mapLangIdToKey(language);
    this.sendSnippetCategoriesToWebView(langKey);
  }

  private sanitizeName(input: string): string {
    return (input || 'snippet')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_\-]/g, '_')
      .replace(/_+/g, '_');
  }

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _context?: vscode.ExtensionContext
  ) {
    // Built-in snippets (read-only)
    this._builtinSnippetsPath = path.join(this._extensionUri.fsPath, 'snippets');

    // User snippets in extension global storage (survives updates)
    const userRootFsPath = this._context?.globalStorageUri?.fsPath
      // Fallback if context wasn’t passed (dev)
      ?? path.join(this._extensionUri.fsPath, '.user-snippets');

    this.userSnippetsPath = path.join(userRootFsPath, 'snippets');
    this.ensureDir(this.userSnippetsPath);
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
      const langKey = this.mapLangIdToKey(vscode.window.activeTextEditor?.document.languageId, 'cpp');
      this.sendSnippetCategoriesToWebView(langKey);
    },10);

    //Update theme of html if vscode changes theme
    vscode.window.onDidChangeActiveColorTheme((theme) => {
      const themeClass = theme.kind === vscode.ColorThemeKind.Dark ? 'vscode-dark' : '';
      this.postMessage({
        command: 'updateThemeClass',
        themeClass,
      });
    });

    webviewView.webview.onDidReceiveMessage(async message => {
      console.log("Received message:", message); // Debug
      switch (message.command) {
                case 'showToast': {
          const { type = 'info', text = '' } = message;
          if (!text) break;

          switch (type) {
            case 'info':
              vscode.window.showInformationMessage(text);
              break;
            case 'warn':
              vscode.window.showWarningMessage(text);
              break;
            case 'error':
              vscode.window.showErrorMessage(text);
              break;
            default:
              vscode.window.showInformationMessage(text);
          }
          break;
        }
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

          const builtinPath = path.join(this._builtinSnippetsPath, language, category, `${subCategory}.json`);
          const userPath    = path.join(this.userSnippetsPath,    language, category, `${subCategory}.json`);

          console.log("Reading (builtin):", builtinPath);
          console.log("Reading (user):", userPath);

          const builtinSnips = this.readJsonIfExists(builtinPath) as Record<string, any>;
          const userSnips    = this.readJsonIfExists(userPath) as Record<string, any>;

          // user overrides built-in on key collision
          const snippets = { ...builtinSnips, ...userSnips };

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
          break;
        }
        case 'previewSnippet': {
          const editor = vscode.window.activeTextEditor;
          if (!editor) break;

          // dispose previous preview
          if (this.previewDecoration) {
            this.previewDecoration.dispose();
            this.previewDecoration = undefined;
          }

          const position = editor.selection.active;
          const snippetLines: string[] = Array.isArray(message.snippet) ? message.snippet : [];
          if (snippetLines.length === 0) break;

          // one type per preview
          const decorationType = vscode.window.createTextEditorDecorationType({
            isWholeLine: true
          });

          const maxLine = Math.max(0, editor.document.lineCount - 1);
          const startLine = Math.min(position.line, maxLine);

          const ranges: vscode.DecorationOptions[] = [];
          let rendered = 0;

          for (let idx = 0; idx < snippetLines.length; idx++) {
            const lno = startLine + idx;
            const text = snippetLines[idx];

            if (lno > maxLine) {
              // file ended — show a small “+N lines” hint on the last line
              ranges.push({
                range: new vscode.Range(maxLine, 0, maxLine, 0),
                renderOptions: {
                  after: {
                    contentText: ` … +${snippetLines.length - rendered} lines`,
                    color: new vscode.ThemeColor('editorGhostText.foreground'),
                    textDecoration: 'font-style: italic;',
                    margin: '0 0 0 1em'
                  }
                }
              });
              break;
            }

            const isFirst = idx === 0;
            ranges.push({
              range: new vscode.Range(lno, 0, lno, 0),
              renderOptions: isFirst
                ? {
                    after: {
                      contentText: text,
                      color: new vscode.ThemeColor('editorGhostText.foreground'),
                      textDecoration: 'font-style: italic;',
                      margin: '0 0 0 1em'
                    }
                  }
                : {
                    before: {
                      contentText: text,
                      color: new vscode.ThemeColor('editorGhostText.foreground'),
                      textDecoration: 'font-style: italic;',
                      margin: '0 0 0 1em'
                    }
                  }
            });
            rendered++;
          }

          editor.setDecorations(decorationType, ranges);
          this.previewDecoration = decorationType;
          break;
        }
        case 'clearPreview': {
          if (this.previewDecoration) {
            this.previewDecoration.dispose();
            this.previewDecoration = undefined;
          }
          break;
        }
        case 'prepareCreateSnippet': {
          // Get current selection (if any) and best-guess language
          const editor = vscode.window.activeTextEditor;
          const selectedText = editor ? editor.document.getText(editor.selection) : '';
          const langKey = this.mapLangIdToKey(editor?.document.languageId, message.requestedLang);
          this.postMessage({
            command: 'openCreateSnippetDialog',
            selectedText,
            language: langKey,
          });
          break;
        }
        case 'getSelectionText': {
          const editor = vscode.window.activeTextEditor;
          const selectedText = editor ? editor.document.getText(editor.selection) : '';
          this.postMessage({ command: 'selectionText', selectedText });
          break;
        }
        case 'createSnippet': {
          type CreatePayload = {
            language: string;
            subcategory: string;
            name: string;
            prefix?: string;
            description?: string;
            body: string; // raw text with newlines
          };
          const data = message.data as CreatePayload;

          const language = this.mapLangIdToKey(undefined, data.language);
          const subcatRaw = data.subcategory?.trim() || 'custom';
          const subcategory = this.sanitizeName(subcatRaw);
          const nameKey = this.sanitizeName(data.name);
          const prefix = (data.prefix && data.prefix.trim()) || nameKey;
          const description = data.description || '';

          // Prepare snippet object
          const bodyLines = data.body.replace(/\r\n/g, '\n').split('\n');

          const snippetObj: any = {
            prefix,
            description,
            body: bodyLines,
          };

          // Ensure directories
          const dir = path.join(this.userSnippetsPath, language, 'custom');
          const filePath = path.join(dir, `${subcategory}.json`);
          this.ensureDir(dir);

          // Read existing JSON (object style), or initialize
          let jsonObj: Record<string, any> = {};
          if (fs.existsSync(filePath)) {
            try {
              jsonObj = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            } catch {
              jsonObj = {};
            }
          }

          // Avoid collision by auto-suffixing
          let finalKey = nameKey;
          let i = 2;
          while (jsonObj[finalKey]) {
            finalKey = `${nameKey}_${i++}`;
          }
          jsonObj[finalKey] = snippetObj;

          // Write back
          fs.writeFileSync(filePath, JSON.stringify(jsonObj, null, 2), 'utf-8');

          // Notify UI & refresh categories for this language
          this.postMessage({
            command: 'snippetSaved',
            language,
            category: 'custom',
            subcategory,
            key: finalKey,
          });

          this.sendSnippetCategoriesToWebView(language);
          break;
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

    const themeClass = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark
                       ? 'vscode-dark' : '';
    html = html.replace('{{themeClass}}', themeClass);

    return html;
  }
}