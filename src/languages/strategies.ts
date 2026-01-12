import * as vscode from 'vscode';

export interface LanguageStrategy {
    languageId: string;
    mainFileName: string;
    compileCommand?: string;
    runCommand?: string;
    defaultContent: string;
}

export const cppStrategy: LanguageStrategy = {
    languageId: 'cpp',
    mainFileName: 'main.cpp',
    defaultContent: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // your code here
    return 0;
}
`
};

export const javaStrategy: LanguageStrategy = {
    languageId: 'java',
    mainFileName: 'Main.java',
    defaultContent: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        // your code here
    }
}
`
};

export const pythonStrategy: LanguageStrategy = {
    languageId: 'python',
    mainFileName: 'main.py',
    defaultContent: `import sys

def main():
    # your code here
    pass

if __name__ == "__main__":
    main()
`
};
