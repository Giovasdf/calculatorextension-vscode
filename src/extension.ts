import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Registrar el comando 'minimalistCalculator.calculate'
  let disposable = vscode.commands.registerCommand(
    "minimalistCalculator.calculate",
    () => {
      // Ejemplo: abrir un panel webview con el contenido HTML directamente
      openWebViewPanel(context);
    }
  );

  context.subscriptions.push(disposable);
}

function openWebViewPanel(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    "minimalistCalculator", // Identificador único del panel
    "Minimalist Calculator",
    {
      viewColumn: vscode.ViewColumn.Beside,
    },
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, "media")],
    }
  );

  const cssStyle = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "media", "style.css")
  );
  const jsScript = panel.webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, "media", "scripts.js")
  );

  // Definir el contenido HTML completo dentro de una cadena de texto
  const htmlContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dark Mode Calculator with History</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="${cssStyle}" />
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>
<body class="light-theme"> <!-- Default theme -->
    <h2 style="padding: 10px 0; text-align: left;">Calculator</h2>
    <div class="theme-switcher">
        <button id="dark-theme-button" class="theme-btn" type="button" onclick="setTheme('dark')">
            <i class="fas fa-moon"></i>
        </button>
        <button id="light-theme-button" class="theme-btn" type="button" onclick="setTheme('light')">
            <i class="fas fa-sun"></i> 
        </button>
        <button id="bw-theme-button" class="theme-btn" type="button" onclick="setTheme('bw')">
            <i class="fas fa-adjust"></i> 
        </button>
        
    </div>
    <div class="calculator">
        <div class="calculator-display" id="calculator-display">0</div>
        <div class="calculator-buttons">
            <button class="btn-calculator operator" data-operation="clear">C</button>
            <button class="btn-calculator operator" data-operation="divide">÷</button>
            <button class="btn-calculator operator" data-operation="multiply">×</button>
            <button class="btn-calculator operator" data-operation="delete">←</button>
            <button class="btn-calculator" data-value="7">7</button>
            <button class="btn-calculator" data-value="8">8</button>
            <button class="btn-calculator" data-value="9">9</button>
            <button class="btn-calculator operator" data-operation="subtract">-</button>
            <button class="btn-calculator" data-value="4">4</button>
            <button class="btn-calculator" data-value="5">5</button>
            <button class="btn-calculator" data-value="6">6</button>
            <button class="btn-calculator operator" data-operation="add">+</button>
            <button class="btn-calculator" data-value="1">1</button>
            <button class="btn-calculator" data-value="2">2</button>
            <button class="btn-calculator" data-value="3">3</button>
            <button class="btn-calculator operator" data-operation="calculate">=</button>
            <button class="btn-calculator" data-value="0">0</button>
            <button class="btn-calculator" data-value=".">.</button>
            <button class="btn-calculator operator" data-operation="clear-all">CE</button>
            <button class="btn-calculator operator" data-operation="negate">+/-</button>
        </div>
    </div>
    <div class="history">
        <h3 class="sticky-title">History</h3>
        <div class="history-container" id="history-container">
        </div>
    </div>
    <!-- Script personalizado -->
    <script src="${jsScript}"></script>
</body>
</html>



    `;

  // Asignar el contenido HTML al panel webview
  panel.webview.html = htmlContent;
}

export function deactivate() {}
