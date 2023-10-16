class Calculator {
  // constructor
  constructor(currentOperandTextElement) {
    this.currentOperandTextElement = currentOperandTextElement;
    this.clear(); // clear calculator when creating a new object
  }

  // method for AC button
  clear() {
    this.previousOperand = '';
    this.currentOperand = '';
    this.operation = undefined;
  }

  changeSign() {
    if (this.currentOperand.toString()[0] === '-') {
      this.currentOperand = this.currentOperand.toString().slice(1);
    }
    else {
      this.currentOperand = '-' + this.currentOperand.toString();
    }
  }

  percentage() {
    this.currentOperand = this.currentOperand / 100;
  }

  // method for operands
  appendNumber(number) {
    // we cannot append "." if "." already is in the number
    if (number === '.' && this.currentOperand.toString().includes('.')) {
      return;
    }
    if (number === '.' && this.currentOperand.toString() === '') {
      this.currentOperand = this.currentOperand.toString() + '0';
    }
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  // method for operations
  chooseOperation(operation) {
    if (this.currentOperand === '') {
      return;
    }
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation; // update operation
    this.previousOperand = this.currentOperand; // we're finished with the currentOperand, store it in previousOperand
    this.currentOperand = ''; // expect a new currentOperand
  }

  // method for to compute combination of previousOperand, currentOperand, and operator
  compute() {
    let result;
    const previousValue = parseFloat(this.previousOperand);
    const currentValue = parseFloat(this.currentOperand);
    // need a valid previousValue and currentValue to do a computation
    if (isNaN(previousValue) || isNaN(currentValue)) {
      return;
    }
    else {
      switch(this.operation) {
        case '+':
          result = previousValue + currentValue;
          break;
        case '-':
          result = previousValue - currentValue;
          break;
        case '*':
          result = previousValue * currentValue;
          break;
        case '/':
          result = previousValue / currentValue;
          break;
        default:
          return;
      }
      this.currentOperand = result; // new number display on screen is the one we calculated
      this.operation = undefined;
      this.previousOperand = '';
    }
  }

  // checks length and formats
  formatDisplay(number) {
    if (number === '') {
      return '';
    }
    if (number.toString() === '.') {
      return '.';
    }
    if (number.toString().length > 9) {
      return parseFloat(number).toExponential(3);
    }
    else {
      let isNegative = number.toString()[0] === '-' ? true  : false;
      let integerDigits = parseFloat(number.toString().split('.')[0]);
      let decimalDigits = number.toString().split('.')[1];
      let integerDisplay;
      if (isNaN(integerDigits)) {
        integerDisplay = '';
      }
      else {
        integerDisplay = integerDigits.toLocaleString('en', {maximumFractionDigits: 0});
      }
      if (decimalDigits !== undefined) {
        return `${integerDisplay}.${decimalDigits}`;
      }
      else {
        return integerDisplay;
      }
    }
  }

  // method to update display on screen
  updateDisplay() {
    if (this.currentOperand !== '') {
      this.currentOperandTextElement.innerText = this.formatDisplay(this.currentOperand);
    }
    else {
      this.currentOperandTextElement.innerText = this.formatDisplay(this.previousOperand);
    }
  }
}

// query selectors for buttons
const numberButtons = document.querySelectorAll('.operand-button'); // includes the "." decimal symbol
const operationButtons = document.querySelectorAll('.operator-button');
const allClearButton = document.querySelector('#all-clear-button');
const signChangeButton = document.querySelector('#sign-change-button');
const percentageButton = document.querySelector('#percentage-button');
const equalsButton = document.querySelector('#equals-button');
// const previousOperandTextElement = 0;
const currentOperandTextElement = document.querySelector('#display');

// creating new object
const calculator = new Calculator(currentOperandTextElement);

// for each button in numberButtons, append the innerText of the button and update the display on screen
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

// for each button in operationButtons, choose the operation of the button and update the display on screen
operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.value);
    calculator.updateDisplay();
  });
});

// for allClearButton, clear and update the display on screen
allClearButton.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

// for signChangeButton, change sign and update the display on screen
signChangeButton.addEventListener('click', () => {
  calculator.changeSign();
  calculator.updateDisplay();
});

// for percentageButton, convert to percentage and update the display on screen
percentageButton.addEventListener('click', () => {
  calculator.percentage();
  calculator.updateDisplay();
});

// for equalsButton, compute and update the display on screen
equalsButton.addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});