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
    inputDisplay.textContent = inputDisplay.textContent.slice(0,-1);
    if(inputDisplay.textContent.length === 0) inputDisplay.textContent = "0";
}

deleteButton.addEventListener("click", deleteFunction);


function addButtonToInputDisplay(button) {
    if (/AC|DEL/g.test(button.innerText)) return;
    
    inputDisplay.innerText += button.innerText;
};

allButtons.map(button => {
    button.addEventListener("click", () => addButtonToInputDisplay(button) )
    }
);


