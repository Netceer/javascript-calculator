 const clearButton = document.querySelector("#clear");
 const outputDisplay = document.querySelector("#output-display");
 const inputDisplay = document.querySelector("#input-display");
 const deleteButton = document.querySelector("#delete");

 const numberButtons = [...document.querySelectorAll(".number-button")];
 const allButtons = [...document.querySelectorAll("button")];

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
    if(inputDisplay.innerText == "0") inputDisplay.innerText = "";
    
    if(button.innerText === "." && inputDisplay.innerText.includes(".")) return;

    inputDisplay.innerText += button.innerText;
    outputDisplay.style.visibility = "visible";
    outputDisplay.innerText = inputDisplay.innerText;
};

allButtons.map(button => {
    button.addEventListener("click", () => addButtonToInputDisplay(button) )
    }
);

