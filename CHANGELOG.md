# Change Log

All notable changes to the "oneclick-cp" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## v0.1.7
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





