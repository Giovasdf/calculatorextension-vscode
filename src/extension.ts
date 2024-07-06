import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('minimalistCalculator.calculate', async () => {
        const panel = vscode.window.createWebviewPanel(
            'calculator',
            'Minimalist Calculator',  // Cambia el título del panel webview
            vscode.ViewColumn.Beside,
            {
                enableScripts: true
            }
        );

        const webviewPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview.html'));
        panel.webview.html = await readHtmlFile(webviewPath);

        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'calculate':
                        const result = parseFloat(message.num1) + parseFloat(message.num2);
                        panel.webview.postMessage({ command: 'showResult', result: result.toString() });
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(disposable);
}

async function readHtmlFile(filePath: vscode.Uri): Promise<string> {
    try {
        const content = await vscode.workspace.fs.readFile(filePath);
        return Buffer.from(content).toString('utf8');
    } catch (error) {
        console.error(`Error reading file: ${error}`);
        return '';
    }
}

export function deactivate() {}
