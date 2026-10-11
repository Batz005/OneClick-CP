// Regenerates package.json "contributes.snippets" from the files under snippets/.
// Usage: node scripts/generateSnippetList.js          (write)
//        node scripts/generateSnippetList.js --check  (fail if out of date — for CI/prepublish)
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const snippetsDir = path.join(root, 'snippets');
const pkgPath = path.join(root, 'package.json');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { return walk(p); }
    return e.name.endsWith('.json') && e.name !== 'snippets_manifest.json' ? [p] : [];
  });
}

const entries = [];
for (const lang of fs.readdirSync(snippetsDir).filter(f => fs.statSync(path.join(snippetsDir, f)).isDirectory()).sort()) {
  for (const file of walk(path.join(snippetsDir, lang)).sort()) {
    JSON.parse(fs.readFileSync(file, 'utf8')); // throws on invalid JSON
    entries.push({ language: lang, path: './' + path.relative(root, file).split(path.sep).join('/') });
  }
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const current = JSON.stringify(pkg.contributes.snippets);
if (process.argv.includes('--check')) {
  if (current !== JSON.stringify(entries)) {
    console.error('package.json contributes.snippets is out of date. Run: node scripts/generateSnippetList.js');
    process.exit(1);
  }
  console.log(`snippets OK (${entries.length} files)`);
} else {
  pkg.contributes.snippets = entries;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`Wrote ${entries.length} snippet entries to package.json`);
}
