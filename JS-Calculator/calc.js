// Calculator class to manage all calculator operations
class Calculator {
  constructor(previousOperationElement, currentOperationElement) {
    this.previousOperationElement = previousOperationElement;
    this.currentOperationElement = currentOperationElement;
    this.clear();
  }

  // Clear all values and reset calculator
  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
    this.shouldResetScreen = false;
  }

  // Delete the last digit entered
  delete() {
    if (this.shouldResetScreen) return;
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  // Append number or decimal point to current operand
  appendNumber(number) {
    // Reset screen after calculation if needed
    if (this.shouldResetScreen) {
      this.currentOperand = "";
      this.shouldResetScreen = false;
    }

    // Prevent multiple decimal points
    if (number === "." && this.currentOperand.includes(".")) return;

    // Prevent leading zeros except for decimal numbers
    if (this.currentOperand === "0" && number !== ".") {
      this.currentOperand = number;
      return;
    }

    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

  // Choose arithmetic operation
  chooseOperation(operation) {
    // Don't allow operation if current operand is empty
    if (this.currentOperand === "") return;

    // Compute previous operation if exists
    if (this.previousOperand !== "") {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  // Perform the calculation
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    // Validate operands
    if (isNaN(prev) || isNaN(current)) return;

    // Perform operation based on operator
    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "×":
        computation = prev * current;
        break;
      case "÷":
        // Handle division by zero
        if (current === 0) {
          this.showError("Error: Cannot divide by zero");
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    // Round to prevent floating point errors
    computation = Math.round(computation * 100000000) / 100000000;

    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = "";
    this.shouldResetScreen = true;
  }

  // Display error message
  showError(message) {
    this.previousOperationElement.textContent = "";
    this.currentOperationElement.textContent = message;
    this.currentOperationElement.classList.add("error-message");
    this.previousOperand = "";
    this.currentOperand = "";
    this.operation = undefined;

    // Clear error after 2 seconds
    setTimeout(() => {
      this.currentOperationElement.classList.remove("error-message");
      this.currentOperand = "";
      this.updateDisplay();
    }, 2000);
  }

  // Format number for display
  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;

    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  // Update the display
  updateDisplay() {
    this.currentOperationElement.textContent =
      this.getDisplayNumber(this.currentOperand) || "0";

    if (this.operation != null) {
      this.previousOperationElement.textContent = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperationElement.textContent = "";
    }
  }
}

// Initialize calculator
const previousOperationElement = document.getElementById("previousOperation");
const currentOperationElement = document.getElementById("currentOperation");
const calculator = new Calculator(
  previousOperationElement,
  currentOperationElement
);

// Update display initially
calculator.updateDisplay();

// Override updateDisplay to call after each operation
const originalMethods = ["clear", "delete", "appendNumber", "chooseOperation"];
originalMethods.forEach((method) => {
  const original = calculator[method];
  calculator[method] = function (...args) {
    original.apply(this, args);
    this.updateDisplay();
  };
});

// Special handling for compute to not auto-update display
const originalCompute = calculator.compute;
calculator.compute = function (...args) {
  const result = originalCompute.apply(this, args);
  // Only update display if not showing error
  if (!this.currentOperationElement.classList.contains("error-message")) {
    this.updateDisplay();
  }
  return result;
};

// Keyboard support
document.addEventListener("keydown", (e) => {
  // Numbers
  if (e.key >= 0 && e.key <= 9) {
    calculator.appendNumber(e.key);
  }
  // Decimal point
  if (e.key === ".") {
    calculator.appendNumber(".");
  }
  // Operations
  if (e.key === "+") {
    calculator.chooseOperation("+");
  }
  if (e.key === "-") {
    calculator.chooseOperation("-");
  }
  if (e.key === "*") {
    calculator.chooseOperation("×");
  }
  if (e.key === "/") {
    e.preventDefault(); // Prevent browser search
    calculator.chooseOperation("÷");
  }
  // Enter or Equals
  if (e.key === "Enter" || e.key === "=") {
    calculator.compute();
  }
  // Backspace
  if (e.key === "Backspace") {
    calculator.delete();
  }
  // Escape or Clear
  if (e.key === "Escape" || e.key.toLowerCase() === "c") {
    calculator.clear();
  }
});
