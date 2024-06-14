const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const themeSwitch = document.getElementById('theme-switch');
const historyList = document.getElementById('history-list');
const clickSound = document.getElementById('click-sound');

let currentInput = '0';
let firstOperand = null;
let operator = null;
let shouldResetScreen = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        playSound();
        if (button.hasAttribute('data-number')) {
            appendNumber(button.getAttribute('data-number'));
        } else if (button.hasAttribute('data-operation')) {
            setOperation(button.getAttribute('data-operation'));
        } else if (button.hasAttribute('data-equals')) {
            evaluate();
        } else if (button.hasAttribute('data-clear')) {
            clear();
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) {
        appendNumber(e.key);
    } else if (['+', '-', '*', '/'].includes(e.key)) {
        setOperation(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        evaluate();
    } else if (e.key === 'Escape' || e.key === 'c') {
        clear();
    }
});

themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
});

function appendNumber(number) {
    if (currentInput === '0' || shouldResetScreen) {
        resetScreen();
        currentInput = number;  // Start with the new number
    } else {
        currentInput += number; // Append the new number
    }
    updateDisplay();
}

function setOperation(operation) {
    if (currentInput === '') return;
    if (firstOperand !== null) {
        evaluate();
    }
    firstOperand = currentInput;
    operator = operation;
    shouldResetScreen = true;
}

function evaluate() {
    if (operator === null || shouldResetScreen) return;
    if (operator === '/' && currentInput === '0') {
        alert("You can't divide by 0!");
        return;
    }

    const result = operate(firstOperand, currentInput, operator);
    addToHistory(`${firstOperand} ${operator} ${currentInput} = ${result}`);
    currentInput = result;
    operator = null;
    firstOperand = null;
    shouldResetScreen = true;
    updateDisplay();
}

function clear() {
    currentInput = '0';
    firstOperand = null;
    operator = null;
    updateDisplay();
}

function resetScreen() {
    currentInput = '';
    shouldResetScreen = false;
}

function updateDisplay() {
    display.textContent = currentInput;
}

function operate(a, b, operation) {
    a = parseFloat(a);
    b = parseFloat(b);
    switch (operation) {
        case '+':
            return (a + b).toString();
        case '-':
            return (a - b).toString();
        case '*':
            return (a * b).toString();
        case '/':
            return (a / b).toString();
        default:
            return '';
    }
}

function addToHistory(entry) {
    const li = document.createElement('li');
    li.textContent = entry;
    historyList.appendChild(li);
}

function playSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}
