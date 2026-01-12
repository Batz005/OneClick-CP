import * as vscode from 'vscode';
import { LanguageStrategy, cppStrategy, javaStrategy, pythonStrategy, javascriptStrategy } from './strategies';

export class LanguageManager {
    private strategies: Map<string, LanguageStrategy>;

    constructor() {
        this.strategies = new Map();
        this.registerStrategy(cppStrategy);
        this.registerStrategy(javaStrategy);
        this.registerStrategy(pythonStrategy);
        this.registerStrategy(javascriptStrategy);
    }

    public registerStrategy(strategy: LanguageStrategy) {
        this.strategies.set(strategy.languageId, strategy);
    }

    public getStrategy(languageId: string): LanguageStrategy {
        return this.strategies.get(languageId) || cppStrategy; // Default to C++
    }

    public getStrategyByFileName(fileName: string): LanguageStrategy {
        if (fileName.endsWith('.cpp') || fileName.endsWith('.cc') || fileName.endsWith('.cxx')) {
            return cppStrategy;
        }
        if (fileName.endsWith('.java')) {
            return javaStrategy;
        }
        if (fileName.endsWith('.py')) {
            return pythonStrategy;
        }
        if (fileName.endsWith('.js')) {
            return javascriptStrategy;
        }
        return cppStrategy;
    }

    public getAllStrategies(): LanguageStrategy[] {
        return Array.from(this.strategies.values());
    }
}
