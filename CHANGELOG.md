# Change Log

All notable changes to the "oneclick-cp" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## v0.1.9
### Fixed
- **Export + Reset no longer deletes your work when the export is cancelled.** Previously, cancelling (or failing) the export still reset `main`, `input.txt` and `output.txt`.
- Built-in snippets: fixed a broken snippet path in `package.json` (`snippets/java/java.json` did not exist) and added the Python/Java/JavaScript misc snippets (fast I/O, buffered output, deep-recursion helpers). Those files were empty and never registered.
- Sidebar sometimes showed empty template/snippet lists: initial data is now sent once the sidebar is ready, instead of on a timer.
- The sidebar no longer leaks a theme-change listener every time it's reopened.
- Reset/Export/Layout now use the language of the active editor before guessing from files on disk.
- Export and Save Template now include unsaved changes from background tabs, and match files by exact path (previously a `Solutions/x/main.cpp` could be picked up).
- Reset writes through open editors, so you no longer get "file changed on disk" conflicts.
- Saving or deleting a custom template no longer copies every built-in template into your `settings.json`.
- Export rejects folder names containing slashes or `..`.
- Settings schema: `additionalProperties` for templates was declared in the wrong place.
- Accessibility: accordion `aria-expanded` state was inverted.

### Internal
- `contributes.snippets` is generated from the `snippets/` folder (`npm run snippets`) and verified before publishing.
- Release workflow: fixed the Open VSX step (secrets can't be used in `if:`), publish the exact VSIX that was built, Node 22.

## v0.1.8
### Added
- **Multi-Language Support**: Full support for **C++**, **Java**, **Python**, and **JavaScript**.
- **Exhaustive Snippets**: Comprehensive snippet library for all supported languages (Algorithms & Data Structures).
- **Modern UI/UX**: Completely redesigned sidebar with a premium look, better spacing, and smooth animations.
- **Smart Snippet Preview**: Snippet preview now positions smartly (below/above) to avoid layout shifts and overlap.
- **JavaScript Support**: Added `main.js` to templates and `createSnippet` support for JS.

### Changed
- **Refactored Architecture**: Introduced `LanguageManager` and `LanguageStrategy` for scalable language support.
- **Improved Templates**: Default templates now include `Fast_IO` and `Debug` implementations for all languages.
- **Updated README**: Comprehensive documentation for all new features.

## v0.1.6
- Fixed showPreview check.
- removed preview status 
- Added snippet Index

## v0.1.5
### Added
- **Snippets Sidebar**: Browse categories/subcategories, preview inline, and insert snippets for C++/Python/Java.
- **Create Snippet from Selection**: Save highlighted code into `Custom/<subcategory>.json` with collision-safe keys.
- **Arrange Layout** command: reliably opens `main.cpp` (left), `input.txt` (top-right), `output.txt` (bottom-right) after closing all editors.

### Changed
- **Templates**: More resilient reset flow — falls back to defaults if a template omits any file; skips `/Solutions/` folders.
- **Export Solution**: Reads from open editors first (unsaved work is included), then falls back to disk.

### Fixed
- **Sidebar expand logic**: Ensures the top-level “Snippets” accordion stays open and the correct subcategory auto-expands after saving.
- **ARIA / a11y**: Corrected `aria-expanded` state for accordions.
- **Language mapping**: `refreshSnippetCategories()` now passes the language correctly to `mapLangIdToKey`.
- **Command logging**: Now logs the resolved list of registered commands instead of a Promise.
- Minor cleanups and stability improvements.

## v0.1.2
- Fixing icons

## v0.1.1
- Webpack is not considering html files which breaks the ui. Issue fixed. 

## v0.1.0
- Initial release: Reset Files, Export Solution, Custom Templates, Editor Snippets.





