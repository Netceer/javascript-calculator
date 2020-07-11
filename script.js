const clearButton = document.querySelector("#clear");
const outputDisplay = document.querySelector("#output-display");
const inputDisplay = document.querySelector("#input-display");
const deleteButton = document.querySelector("#delete");
const equalsButton = document.querySelector("#equals");

const allButtons = document.querySelectorAll("button");
const operatorButtons = document.querySelectorAll(".operator-button");

function clearFunction() {
  outputDisplay.style.visibility = "hidden";
  outputDisplay.innerText = "0";
  inputDisplay.innerText = "0";
  hasDecimal = false;
}

let endOfCalculation = false;
let hasDecimal = false;

clearButton.addEventListener("click", clearFunction);

function deleteFunction() {
  if (inputDisplay.innerText.slice(-1) === ".") hasDecimal = false;
  
  inputDisplay.innerText = inputDisplay.innerText.slice(0, -1);
  
  if (inputDisplay.innerText.length === 0) {
    inputDisplay.innerText = "0";
    outputDisplay.innerText = "";
    outputDisplay.style.visibility = "hidden";
  }

  outputDisplay.innerText = inputDisplay.innerText;
  if (!/[+÷×−]/g.test(inputDisplay.innerText.slice(-1)))
    outputDisplay.innerText = calculate();
}

deleteButton.addEventListener("click", deleteFunction);

function addButtonToInputDisplay(button) {
  if (/AC|DEL/g.test(button.innerText)) return;
  if (inputDisplay.innerText == "0" && button.innerText !== ".")
    inputDisplay.innerText = "";
  if (outputDisplay.textContent == "0" && button.innerText !== ".")
    outputDisplay.innerText = "";
  if (button.innerText === "." && hasDecimal) return;
  if (button.innerText === ".") hasDecimal = true;
  if (/[+÷×−=]/g.test(button.innerText)) return;
  if (/[+÷×=]/g.test(inputDisplay.innerText.slice(0, 1))) {
    inputDisplay.innerText = "";
    outputDisplay.innerText = "";
  }
  if (button.innerText === "=") return;
  if (endOfCalculation) {
    inputDisplay.innerText = "";
    endOfCalculation = false;
  }
  outputDisplay.classList.remove("fade-out");
  inputDisplay.innerText += button.innerText;
  outputDisplay.style.visibility = "visible";
  outputDisplay.innerText += button.innerText;
  
  if (button.innerText != ".") outputDisplay.innerText = calculate();
}

allButtons.forEach((button) => {
  button.addEventListener("click", () => addButtonToInputDisplay(button))
});


function handleOperatorInput(operator) {
  endOfCalculation = false;
  hasDecimal = false;
  outputDisplay.classList.remove("fade-out");
  if (
    /[+÷×−]/g.test(inputDisplay.innerText.slice(-1)) &&
    /[+÷×−]/g.test(inputDisplay.innerText.slice(-2, -1)) &&
    /[+÷×−]/g.test(operator.innerText)
  ) {
    if (
      inputDisplay.innerText.slice(-1) === "−" &&
      operator.innerText === "−"
    ) {
      inputDisplay.innerText = inputDisplay.innerText.slice(0, -2) + "+";
      outputDisplay.innerText = outputDisplay.innerText.slice(0, -2) + "+";
      return;
    }

    inputDisplay.innerText =
      inputDisplay.innerText.slice(0, -2) + operator.innerText;
    outputDisplay.innerText =
      outputDisplay.innerText.slice(0, -2) + operator.innerText;
    return;
  }

  if (/[+÷×−]/g.test(inputDisplay.innerText.slice(-1))) {
    if (
      inputDisplay.innerText.slice(-1) === "−" &&
      operator.innerText === "−"
    ) {
      inputDisplay.innerText = inputDisplay.innerText.slice(0, -1) + "+";
      outputDisplay.innerText = outputDisplay.innerText.slice(0, -1) + "+";
      if (/[+÷×−]/g.test(inputDisplay.innerText.slice(-2, -1))) {
        inputDisplay.innerText = inputDisplay.innerText.slice(0, -1);
        outputDisplay.innerText = outputDisplay.innerText.slice(0, -1);
      }
      return;
    }

    if (
      inputDisplay.innerText.slice(-1) === "+" &&
      operator.innerText === "−"
    ) {
      inputDisplay.innerText = inputDisplay.innerText.slice(0, -1) + "−";
      outputDisplay.innerText = outputDisplay.innerText.slice(0, -1) + "−";
      return;
    }

    if (
      operator.innerText === "−" &&
      /[+÷×−]/g.test(inputDisplay.innerText.slice(-1))
    ) {
      inputDisplay.innerText += operator.innerText;
      outputDisplay.innerText += operator.innerText;
      return;
    }

    inputDisplay.innerText =
      inputDisplay.innerText.slice(0, -1) + operator.innerText;
    outputDisplay.innerText =
      outputDisplay.innerText.slice(0, -1) + operator.innerText;
    return;
  }
  inputDisplay.innerText += operator.innerText;
  outputDisplay.style.visibility = "visible";
  outputDisplay.innerText += operator.innerText;
}

operatorButtons.forEach((operator) => {
  operator.addEventListener("click", () => handleOperatorInput(operator));
});

function convertSymbols(inputString) {
  return inputString
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/([+-/*])-(\d+(\.\d*)?)/g, "$1$2Neg")
    .replace(/^-(\d+(\.\d*)?)/, "$1Neg");
}

function calculate() {
  let inputString = inputDisplay.innerText;

  if (/[+÷×−]/g.test(inputDisplay.innerText.slice(-1))) return;
  if (inputString === "") inputString = "0";

  let convertedString = convertSymbols(inputString);
  let postFixQueue = convertInfixToPostfix(convertedString);
  let result = postFixEvaluator(postFixQueue).toString();
  if (result.split(".")[1] && result.split(".")[1].length > 5)
    return (+result).toFixed(4);
  return result;
}

function convertInfixToPostfix(stringToConvert) {

  // applying shunting-yard algorithm
  let operatorStack = [];
  let postFixQueue = [];

  const splitString = stringToConvert.split(/([+/*-])/);

  const operatorPrecedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
  };

  splitString.map((token) => {
    let tokenPrecedence = operatorPrecedence[token];
    let topOfStackPrecedence = 0;
    if (operatorStack.length > 0) {
      topOfStackPrecedence =
        operatorPrecedence[operatorStack[operatorStack.length - 1]];
    }

    // if token is a number
    if (!/[+/*-]/.test(token)) {
      postFixQueue.push(token);
    }

    // if token is an operator and operator stack is empty or token precedence > top of stack precedence
    else if (
      /[+/*-]/.test(token) &&
      (operatorStack.length === 0 || tokenPrecedence > topOfStackPrecedence)
    ) {
      operatorStack.push(token);
    }

    // if the operator in stack is of higher precedance than the token then you have to pop that operator first
    else {
      while (tokenPrecedence <= topOfStackPrecedence) {
        postFixQueue.push(operatorStack.pop());
        topOfStackPrecedence = 0;
        if (operatorStack.length > 0) {
          topOfStackPrecedence =
            operatorPrecedence[operatorStack[operatorStack.length - 1]];
        }
      }
      operatorStack.push(token);
    }
  });

  // if there are still operators left in stack then pop them off and add to postFixQueue
  while (operatorStack.length > 0) {
    postFixQueue.push(operatorStack.pop());
  }

  return postFixQueue;
}

function postFixEvaluator(postFixQueue) {
  let resultStack = [];

  postFixQueue.map((token) => {
    if (!/[+/*-]/.test(token)) {
      // convert numbers with Neg to real negative numbers
      //   then push token converted to a number
      resultStack.push(+token.replace(/(.+)Neg/, "-$1"));
    } else {
      //   if operator then we pop off numbers in resultStack and operate on them
      const RHS = resultStack.pop();
      const LHS = resultStack.pop();

      switch (token) {
        case "*":
          resultStack.push(LHS * RHS);
          break;
        case "/":
          resultStack.push(LHS / RHS);
          break;
        case "+":
          resultStack.push(LHS + RHS);
          break;
        case "-":
          resultStack.push(LHS - RHS);
          break;
      }
    }
  });

  return resultStack.pop();
}

equalsButton.addEventListener("click", () => {
  if (calculate() === undefined) return;
  outputDisplay.classList.add("fade-out");
  inputDisplay.innerText = calculate();
  if (!inputDisplay.innerText.includes(".")) hasDecimal = false;
  endOfCalculation = true;
});
