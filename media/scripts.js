const displayElement = document.getElementById('calculator-display');
const historyContainer = document.getElementById('history-container');
let currentInput = '';
let currentOperation = null;
let buffer = '';

// Leer el tema guardado en localStorage y aplicarlo al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('calculatorTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
});

document.querySelectorAll('.btn-calculator').forEach(button => {
    button.addEventListener('click', () => {
        const { value, operation } = button.dataset;

        // Remove active class from all buttons
        document.querySelectorAll('.btn-calculator').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to the clicked button
        button.classList.add('active');

        if (operation === 'clear') {
            clearDisplay();
        } else if (operation === 'delete') {
            deleteLastDigit();
        } else if (operation === 'calculate') {
            calculateResult();
        } else if (operation === 'clear-all') {
            clearAll();
        } else if (operation === 'negate') {
            negateNumber();
        } else if (operation) {
            handleOperation(operation);
        } else {
            appendNumber(value);
        }
    });
});

function clearDisplay() {
    currentInput = '';
    currentOperation = null;
    buffer = '';
    updateDisplay('0');
}

function deleteLastDigit() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput);
}

function handleOperation(operation) {
    if (currentInput === '' && operation !== 'subtract') {
        return; // No se puede empezar con un operador (excepto resta negativa)
    }

    if (currentOperation && buffer && currentInput === '') {
        // Si ya hay una operación y buffer pero no hay un nuevo número ingresado
        currentOperation = operation;
        updateDisplay(buffer);
        return;
    }

    // Check if the same operator is clicked twice
    if (operation === currentOperation && buffer) {
        calculateResult();
        return;
    }

    // Si el botón anterior fue "=" y el siguiente es un número, limpiar la calculadora
    if (currentOperation === 'calculate' && !isNaN(parseInt(operation))) {
        clearDisplay();
    }

    currentOperation = operation;
    buffer = currentInput;
    currentInput = '';

    // Update display with buffer value when operator is clicked
    updateDisplay(buffer);
}

function appendNumber(number) {
    if (number === '.' && currentInput.includes('.')) {return;}
    currentInput += number;
    updateDisplay(currentInput);
}

function calculateResult() {
    let result;
    const num1 = parseFloat(buffer);
    const num2 = parseFloat(currentInput);

    switch (currentOperation) {
        case 'add':
            result = num1 + num2;
            break;
        case 'subtract':
            result = num1 - num2;
            break;
        case 'multiply':
            result = num1 * num2;
            break;
        case 'divide':
            result = num1 / num2;
            break;
        default:
            return;
    }

    showHistory(`${buffer} ${getOperationSymbol(currentOperation)} ${currentInput}`, result);

    updateDisplay(result.toString());
    currentInput = result.toString();
    currentOperation = 'calculate'; // Marcar la operación como '=' para el siguiente click
}

function updateDisplay(value) {
    displayElement.textContent = value;
}

function showHistory(operation, result) {
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');

    const operationLabel = document.createElement('div');
    operationLabel.classList.add('history-operation');
    operationLabel.textContent = operation;

    const resultLabel = document.createElement('div');
    resultLabel.classList.add('history-result');
    resultLabel.textContent = result;

    historyItem.appendChild(operationLabel);
    historyItem.appendChild(resultLabel);

    historyContainer.prepend(historyItem); // Agregar al inicio para mostrar el historial más reciente arriba
}

function getOperationSymbol(operation) {
    switch (operation) {
        case 'add':
            return '+';
        case 'subtract':
            return '-';
        case 'multiply':
            return '×';
        case 'divide':
            return '÷';
        default:
            return '';
    }
}

function clearAll() {
    clearDisplay();
    currentOperation = null;
    buffer = '';
}

function negateNumber() {
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay(currentInput);
}

// Funciones para cambiar el tema
function setTheme(theme) {
    // Limpiar todas las clases existentes en el body y agregar la clase del nuevo tema
    document.body.className = '';
    document.body.classList.add(theme + '-theme');

    // Guardar el tema seleccionado en localStorage
    localStorage.setItem('calculatorTheme', theme);
}



document.getElementById('dark-theme-button').addEventListener('click', () => {
    setTheme('dark');
});

document.getElementById('light-theme-button').addEventListener('click', () => {
    setTheme('light');
});

document.getElementById('bw-theme-button').addEventListener('click', () => {
    setTheme('bw');
});
