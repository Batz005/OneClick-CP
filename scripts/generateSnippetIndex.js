const fs = require("fs");
const path = require("path");

const snippetsDir = path.join(__dirname, "../snippets");
const outputFile = path.join(__dirname, "../docs/snippets-index.md");

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith(".json")) {
      results.push(fullPath);
    }
  });
  return results;
}

function generateMarkdown() {
  let md = `# 📑 Snippets Index\n\n`;
  md += `This document lists all built-in snippets, grouped by language and category.\n\n`;
  md += `👉 To add your own, use the **Custom** folder (shown in sidebar when creating snippets).\n\n---\n`;

  // Collect quick navigation
  let quickNav = `## 🔗 Quick Navigation\n`;
  const languageDirs = fs.readdirSync(snippetsDir).filter((d) =>
    fs.statSync(path.join(snippetsDir, d)).isDirectory()
  );

  for (const lang of languageDirs) {
    quickNav += `- [${lang.toUpperCase()}](#🖥️-${lang.toLowerCase()})\n`;
  }
  quickNav += `- [Custom](#✨-custom)\n\n---\n`;

  md += quickNav;

  // Build detailed sections
  for (const lang of languageDirs) {
    md += `\n## 🖥️ ${lang.toUpperCase()}\n\n`;

    const files = walk(path.join(snippetsDir, lang));

    for (const file of files) {
      const relPath = path.relative(path.join(snippetsDir, lang), file);
      const category = relPath.replace(/\.json$/, "");

      md += `<details>\n<summary>📂 ${category}</summary>\n\n`;

      const content = fs.readFileSync(file, "utf8").trim();
      if (!content) {
        console.warn(`⚠️ Skipping empty file: ${file}`);
        md += `*(No snippets in this category)*\n\n</details>\n\n`;
        continue;
      }

      let json;
      try {
        json = JSON.parse(content);
      } catch (e) {
        console.warn(`⚠️ Invalid JSON in ${file}, skipping.`);
        md += `*(Invalid snippet file)*\n\n</details>\n\n`;
        continue;
      }

      Object.entries(json)
        .sort(([, a], [, b]) =>
          (a.prefix || "").localeCompare(b.prefix || "")
        )
        .forEach(([name, snippet]) => {
          const prefix = snippet.prefix || "-";
          const desc = snippet.description || "(No description)";
          md += `- **${name}** — \`${prefix}\`: ${desc}\n`;
        });

      md += `\n</details>\n\n`;
    }
  }

  // Add special section for custom
  md += `---\n\n## ✨ Custom\n\n`;
  md += `The **Custom** folder is reserved for user-created snippets.\n`;
  md += `These are not listed here since they vary per user.\n`;

  fs.writeFileSync(outputFile, md, "utf8");
  console.log(`✅ Snippets index written to ${outputFile}`);
}

generateMarkdown();