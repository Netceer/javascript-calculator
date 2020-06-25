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
};

clearButton.addEventListener("click", clearFunction);

function deleteFunction() {
    inputDisplay.innerText = inputDisplay.innerText.slice(0,-1);
    if(inputDisplay.innerText.length === 0) {
        inputDisplay.innerText = "0";
        outputDisplay.innerText = "";
        outputDisplay.style.visibility = "hidden";
    }
    outputDisplay.innerText = inputDisplay.innerText;
}

deleteButton.addEventListener("click", deleteFunction);


function addButtonToInputDisplay(button) {
    if(/AC|DEL/g.test(button.innerText)) return;
    if(inputDisplay.innerText == "0" && button.innerText !== ".") inputDisplay.innerText = "";
    if(button.innerText === "." && inputDisplay.innerText.includes(".")) return;
    if(/[+÷×−=]/g.test(button.innerText)) return;
    if(/[+÷×=]/g.test(inputDisplay.innerText.slice(0,1))) inputDisplay.innerText = "";

    inputDisplay.innerText += button.innerText;
    outputDisplay.style.visibility = "visible";
    outputDisplay.innerText = inputDisplay.innerText;
};

allButtons.map(button => {
    button.addEventListener("click", () => addButtonToInputDisplay(button) )
    }
);

function handleOperatorInput(operator) {

    if(/[+÷×−]/g.test(inputDisplay.innerText.slice(-1)) && /[+÷×−]/g.test(inputDisplay.innerText.slice(-2,-1)) && /[+÷×−]/g.test(operator.innerText)) {

        if(inputDisplay.innerText.slice(-1) === "−" && operator.innerText === "−") {
            inputDisplay.innerText = inputDisplay.innerText.slice(0,-2) + "+";
            outputDisplay.style.visibility = "visible";
            outputDisplay.innerText = inputDisplay.innerText;
            return;}

       inputDisplay.innerText = inputDisplay.innerText.slice(0,-2) + operator.innerText;
       outputDisplay.style.visibility = "visible";
       outputDisplay.innerText = inputDisplay.innerText;
       return;
    }

    if(/[+÷×−]/g.test(inputDisplay.innerText.slice(-1))) {

        if(inputDisplay.innerText.slice(-1) === "−" && operator.innerText === "−") {
            inputDisplay.innerText = inputDisplay.innerText.slice(0,-1) + "+";
            if(/[+÷×−]/g.test(inputDisplay.innerText.slice(-2,-1))) {
                inputDisplay.innerText = inputDisplay.innerText.slice(0,-1);
            }
            outputDisplay.style.visibility = "visible";
            outputDisplay.innerText = inputDisplay.innerText;
            return;}

            if(inputDisplay.innerText.slice(-1) === "+" && operator.innerText === "−") {
                inputDisplay.innerText = inputDisplay.innerText.slice(0,-1) + "−";
                outputDisplay.style.visibility = "visible";
                outputDisplay.innerText = inputDisplay.innerText;
                return;}

        if(operator.innerText === "−" && /[+÷×−]/g.test(inputDisplay.innerText.slice(-1))) { 
            inputDisplay.innerText += operator.innerText
        return;}

       inputDisplay.innerText = inputDisplay.innerText.slice(0,-1) + operator.innerText;
       outputDisplay.style.visibility = "visible";
       outputDisplay.innerText = inputDisplay.innerText;
       return;
    }
    inputDisplay.innerText += operator.innerText;
    outputDisplay.style.visibility = "visible";
    outputDisplay.innerText = inputDisplay.innerText;
};

operatorButtons.map(operator => {
    operator.addEventListener("click", () => handleOperatorInput(operator))
});

function convertSymbols(inputString){
    return inputString.replace(/×/g, "*")
                      .replace(/÷/g, "/")
                      .replace(/−/g, "-");
}

function calculate() {
    let inputString = inputDisplay.innerText;
    if(inputString === "") inputString = "0";
    let convertedString = convertSymbols(inputString);
    inputDisplay.innerText = eval(convertedString);
}

equalsButton.addEventListener("click", () => calculate())