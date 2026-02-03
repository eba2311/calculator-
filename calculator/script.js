let display = document.getElementById('result');
let currentInput = '';
let shouldResetDisplay = false;

function updateDisplay() {
    display.value = currentInput || '0';
}

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    currentInput += number;
    updateDisplay();
}

function appendOperator(operator) {
    if (shouldResetDisplay) {
        shouldResetDisplay = false;
    }
    
    // Handle special cases
    if (operator === '^') {
        currentInput += '**';
    } else if (operator === '×') {
        currentInput += '*';
    } else if (operator === '÷') {
        currentInput += '/';
    } else {
        currentInput += operator;
    }
    updateDisplay();
}

function appendFunction(func) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    currentInput += func;
    updateDisplay();
}

function appendConstant(constant) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    currentInput += constant;
    updateDisplay();
}

function clearAll() {
    currentInput = '';
    updateDisplay();
}

function clearEntry() {
    currentInput = '';
    updateDisplay();
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

function calculate() {
    try {
        // Replace mathematical functions with JavaScript equivalents
        let expression = currentInput
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E');
        
        // Convert degrees to radians for trigonometric functions
        expression = expression.replace(/Math\.(sin|cos|tan)\(([^)]+)\)/g, (match, func, angle) => {
            return `Math.${func}(${angle} * Math.PI / 180)`;
        });
        
        let result = eval(expression);
        
        // Handle special cases
        if (isNaN(result)) {
            throw new Error('Invalid calculation');
        }
        
        if (!isFinite(result)) {
            throw new Error('Result is infinity');
        }
        
        // Round to avoid floating point precision issues
        result = Math.round(result * 1000000000000) / 1000000000000;
        
        currentInput = result.toString();
        shouldResetDisplay = true;
        updateDisplay();
        
    } catch (error) {
        currentInput = 'Error';
        shouldResetDisplay = true;
        updateDisplay();
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendNumber(key);
    } else if (key === '+' || key === '-') {
        appendOperator(key);
    } else if (key === '*') {
        appendOperator('*');
    } else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        appendOperator('/');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearAll();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === '(') {
        appendOperator('(');
    } else if (key === ')') {
        appendOperator(')');
    }
});

// Initialize display
updateDisplay();