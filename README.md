<p align="center">
  <img src="https://raw.githubusercontent.com/Batz005/OneClick-CP/main/resources/OneClick_CP_LOGO.png" width="200" alt="OneClick CP Logo" />
</p>

<h1 align="center">OneClick-CP — One-click DSA & CP Starter Kit</h1>

A VS Code extension that sets up your coding sandbox in seconds, exports your solutions neatly, and gives you a growing snippets library — all without leaving the editor.

---

## ✨ Features

### 🚀 Reset Files
Quickly reset the 3 standard files in your workspace:
- `main.cpp`
- `input.txt`
- `output.txt`

Uses the **selected template** (see below). If any file is missing in the chosen template, a sensible default is used.

### 📤 Export Solution
Save your current `main.cpp`, `input.txt`, and `output.txt` into `Solutions/<your-name>/`.  
Reads from the **open editors** first (so unsaved work is exported), then falls back to disk.

### 🔁 Export + Reset
One command to:
1) Export the current solution  
2) Reset the three files with your selected template

Perfect for quick problem switching.

### 💾 Custom Templates
Save any combination of the three files as a reusable template.

- Create templates via the Sidebar → **Save Template**
- Delete templates via the Sidebar → **Delete Template**
- Templates are stored in VS Code settings under `oneclick-cp.templates`

### 📚 Snippets (Sidebar + Editor)
A curated snippet library for **C++**, **Python**, and **Java**. (Only C++ snippets are implemented currently. custom snippets can still be created for other languages)

- **Browse by Category/Subcategory** in the Sidebar
- **Preview** a snippet (inline "ghost" preview)
- **Insert** at the cursor location
- **Create from Selection** → Save highlighted code as a new snippet (auto-name collision handling; saved under `Custom/<subcategory>.json`)
- Built-in snippets are merged with your **user snippets** (user overrides on duplicate keys)

> User snippets are stored under the extension’s global storage path:  
> `<globalStorage>/snippets/<language>/Custom/<subcategory>.json`

👉 Full list of built-in snippets is available here:  
[📑 Snippets Index](./docs/snippets-index.md)

### 🧩 Arrange Layout
Closes all tabs and opens:
- `main.cpp` (left)
- `input.txt` (top-right)
- `output.txt` (bottom-right)

---

## 🧰 Commands & Shortcuts

| Command | ID | Notes |
|---|---|---|
| Reset Files | `oneclick-cp.resetFiles` | Uses currently selected template |
| Export Solution | `oneclick-cp.exportSolution` | Prompts for folder name |
| Export + Reset | _via Sidebar_ | First export, then reset |
| Arrange Layout | `oneclick-cp.arrangeLayout` | Opens 1–2–3 layout |
| Save Template | `oneclick-cp.saveTemplate` | From Sidebar form |
| Delete Template | `oneclick-cp.deleteTemplate` | From Sidebar dropdown |
| Create Snippet (from selection) | `oneclick-cp.createSnippet` | Stored under **Custom** |

> Default keybinding example (optional):  
> - **Reset Files** → `Ctrl + Alt + R` (you can bind this yourself in `Keyboard Shortcuts`)

---

## 🧪 How to Use

1. **Open** your CP workspace folder in VS Code.  
2. Click the **OneClick-CP** icon in the Activity Bar to open the Sidebar.  
3. Pick a **Template** (or create your own).  
4. Click **Reset Files** to bootstrap `main.cpp`, `input.txt`, `output.txt`.  
5. Start coding.  
6. Use **Export Solution** when you’re done (or **Export + Reset** to jump to the next problem).  
7. Use **Snippets** in the Sidebar to preview & insert, or create your own from selection.

---

Shortcuts:
	•	Ctrl + Alt + R → Reset Files
	•	Snippets auto-trigger in editor using defined prefixes

⸻

🙌 Support Development

If you love this extension and want to support its development:
	•	[☕ Buy me a coffee](https://coff.ee/bharathkotipalli) 
	•	UPI ID: bharath.kotipalli@pingpay
	•	⭐ [Starring the repository](https://github.com/Batz005/OneClick-CP)
    •
    

⸻

🛠️ Installation
	1.	Clone or download this repo
	2.	Run npm install
	3.	Run npm run compile
	4.	Launch extension via Run & Debug (F5) or package via vsce

⸻

🤝 Contributing

Pull requests, issue reports, and suggestions are always welcome!
	1.	Fork the repository
	2.	Make your changes
	3.	Submit a PR with a clear explanation

Suggest a Snippet

Feel free to contribute to the snippet JSONs inside snippets/ folder or open an issue with your idea.

[![Stars](https://img.shields.io/github/stars/Batz005/OneClick-CP?style=social)](https://github.com/Batz005/OneClick-CP)
[![Issues](https://img.shields.io/github/issues/Batz005/OneClick-CP)](https://github.com/Batz005/OneClick-CP/issues)
[![License](https://img.shields.io/github/license/Batz005/OneClick-CP)](./LICENSE)

⸻
🧯 Troubleshooting
	•	Sidebar looks empty / styling off → Ensure HTML/CSS files are bundled (we fixed a webpack omission in v0.1.1).
	•	Snippet preview not visible → Make sure an editor is active; preview shows as faint inline text.
	•	Nothing resets → Confirm a workspace is open and the three files exist (fallback will write them to your first workspace).
	•	Exported files missing changes → We read from open editors first; if none open, we read from disk.

____

📝 Changelog

See CHANGELOG.md.

____

👤 Author
<p align="center">
  <img src="https://raw.githubusercontent.com/Batz005/OneClick-CP/main/resources/BK_Logo.png" width="200" alt="Developer BK Logo" />
</p>
Developed by Bharath Kotipalli

“Created to make your CP journey smoother.”


⸻

📃 License

MIT © Bharath Kotipalli