const clearButton = document.querySelector("#clear");
const outputDisplay = document.querySelector("#output-display");
const inputDisplay = document.querySelector("#input-display");
const deleteButton = document.querySelector("#delete");
const equalsButton = document.querySelector("#equals");

const numberButtons = [...document.querySelectorAll(".number-button")];
const allButtons = [...document.querySelectorAll("button")];
const operatorButtons = [...document.querySelectorAll(".operator-button")];

function clearFunction() {
    outputDisplay.style.visibility = "hidden";
    outputDisplay.innerText = "0";
    inputDisplay.innerText = "0";
    hasDecimal = false;
};

let endOfCalculation = false;
let hasDecimal = false;

clearButton.addEventListener("click", clearFunction);

function deleteFunction() {
    inputDisplay.innerText = inputDisplay.innerText.slice(0, -1);

    if (inputDisplay.innerText.length === 0) {
        inputDisplay.innerText = "0";
        outputDisplay.innerText = "";
        outputDisplay.style.visibility = "hidden";
    }

    outputDisplay.innerText = inputDisplay.innerText;
    if (!/[+÷×−]/g.test(inputDisplay.innerText.slice(-1))) outputDisplay.innerText = calculate();

}

deleteButton.addEventListener("click", deleteFunction);


function addButtonToInputDisplay(button) {
    if (/AC|DEL/g.test(button.innerText)) return;
    if (inputDisplay.innerText == "0" && button.innerText !== ".") inputDisplay.innerText = "";
    if (outputDisplay.textContent == "0" && button.innerText !== ".") outputDisplay.innerText = "";
    if (button.innerText === "." && hasDecimal) return;
    if (button.innerText === ".") hasDecimal = true;
    if (/[+÷×−=]/g.test(button.innerText)) return;
    if (/[+÷×=]/g.test(inputDisplay.innerText.slice(0, 1))) {
        inputDisplay.innerText = "";
        outputDisplay.innerText = "";
    }
    if (button.innerText === "=") return;
    if (endOfCalculation) {
        inputDisplay.innerText = ""
        endOfCalculation = false;;
    }
    outputDisplay.classList.remove("fade-out");
    inputDisplay.innerText += button.innerText;
    outputDisplay.style.visibility = "visible";
    outputDisplay.innerText += button.innerText;
    if (button.innerText != ".") outputDisplay.innerText = calculate();
};

allButtons.map(button => {
    button.addEventListener("click", () => addButtonToInputDisplay(button))
}
);

function handleOperatorInput(operator) {
    endOfCalculation = false;
    hasDecimal = false;
    outputDisplay.classList.remove("fade-out");
    if (/[+÷×−]/g.test(inputDisplay.innerText.slice(-1)) && /[+÷×−]/g.test(inputDisplay.innerText.slice(-2, -1)) && /[+÷×−]/g.test(operator.innerText)) {

        if (inputDisplay.innerText.slice(-1) === "−" && operator.innerText === "−") {
            inputDisplay.innerText = inputDisplay.innerText.slice(0, -2) + "+";;
            outputDisplay.innerText = outputDisplay.innerText.slice(0, -2) + "+";
            return;
        }

        inputDisplay.innerText = inputDisplay.innerText.slice(0, -2) + operator.innerText;
        outputDisplay.innerText = outputDisplay.innerText.slice(0, -2) + operator.innerText;
        return;
    }

    if (/[+÷×−]/g.test(inputDisplay.innerText.slice(-1))) {

        if (inputDisplay.innerText.slice(-1) === "−" && operator.innerText === "−") {
            inputDisplay.innerText = inputDisplay.innerText.slice(0, -1) + "+";
            outputDisplay.innerText = outputDisplay.innerText.slice(0, -1) + "+";
            if (/[+÷×−]/g.test(inputDisplay.innerText.slice(-2, -1))) {
                inputDisplay.innerText = inputDisplay.innerText.slice(0, -1);
                outputDisplay.innerText = outputDisplay.innerText.slice(0, -1);
            }
            return;
        }

        if (inputDisplay.innerText.slice(-1) === "+" && operator.innerText === "−") {
            inputDisplay.innerText = inputDisplay.innerText.slice(0, -1) + "−";
            outputDisplay.innerText = outputDisplay.innerText.slice(0, -1) + "−";
            return;
        }

        if (operator.innerText === "−" && /[+÷×−]/g.test(inputDisplay.innerText.slice(-1))) {
            inputDisplay.innerText += operator.innerText
            outputDisplay.innerText += operator.innerText
            return;
        }

        inputDisplay.innerText = inputDisplay.innerText.slice(0, -1) + operator.innerText;
        outputDisplay.innerText = outputDisplay.innerText.slice(0, -1) + operator.innerText;
        return;
    }
    inputDisplay.innerText += operator.innerText;
    outputDisplay.style.visibility = "visible";
    outputDisplay.innerText += operator.innerText;
};

operatorButtons.map(operator => {
    operator.addEventListener("click", () => handleOperatorInput(operator))
});

function convertSymbols(inputString) {
    return inputString.replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-");
}

function calculate() {
    let inputString = inputDisplay.innerText;
    if (/[+÷×−]/g.test(inputDisplay.innerText.slice(-1))) return;
    if (inputString === "") inputString = "0";
    let convertedString = convertSymbols(inputString);
    let result = eval(convertedString).toString();
    if(result.split(".")[1] && result.split(".")[1].length > 5) return (+result).toFixed(4);
    return result;
}

equalsButton.addEventListener("click", () => {
    if (calculate() === undefined) return;
    outputDisplay.classList.add("fade-out");
    inputDisplay.innerText = calculate()
    endOfCalculation = true;
})