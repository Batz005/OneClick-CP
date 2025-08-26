// import * as vscode from 'vscode';

const fs = require("fs");
const path = require("path");

const manifest = require("../snippets/snippets_manifest.json");

const rootPath = "snippets";
const output = [];

for (const [lang, folders] of Object.entries(manifest)) {
  if (Array.isArray(folders)) {
    folders.forEach(file => {
      output.push({
        language: lang,
        path: `./${rootPath}/${lang}/${file}.json`
      });
    });
  } else {
    for (const [subfolder, files] of Object.entries(folders)) {
      files.forEach(file => {
        output.push({
          language: lang,
          path: `./${rootPath}/${lang}/${subfolder}/${file}.json`
        });
      });
    }
  }
}

fs.writeFileSync("./generated_snippets.json", JSON.stringify(output, null, 2));
// vscode.window.showInformationMessage("✅ generated_snippets.json created.");
console.log("✅ generated_snippets.json created.");