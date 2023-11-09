// starting game values
let gameValues = {
  playerName: '',
  remainingMathQuestion:0,
  answeredQuestion:  0,
  startingValue: 0,
  collectedAcorn: []
 }

 /** Get stored gameValues{} stored in local storage */
function getFromLocalStorage(){
  const storedValues = localStorage.getItem(gameValues);
 return storedValues ? JSON.parse(storedValues) : undefined;
}

/** Stores gameValues obj to local storage */
function storeToLocalStorage(){
  localStorage.setItem(gameValues, JSON.stringify(gameValues))
}

/** 
 * IIFE: Handles/modifies players name: chapitalizes first letter and store in localstorage.
 * Displays name on home page in Instructions section.
 * */ 
function handleNameInput(){
  const nameInput = document.getElementById('firstName');
  if(nameInput){
    const firstName = document.getElementById('fname');
    const fname = nameInput.value;
    const nameToLowerCase = fname.toLowerCase();
    const firstLetterCap = nameToLowerCase.charAt(0).toUpperCase() + nameToLowerCase.slice(1);
    firstName.innerText = ` ${firstLetterCap}`
    gameValues.playerName =  firstLetterCap;
    storeToLocalStorage()
  }
};

handleNameInput();

/** Handels challenge input amount and store to localStorage */
function handleNumberInput(nameInput) {
  if(nameInput){
      gameValues.remainingMathQuestion = parseInt(nameInput.value)
      gameValues.startingValue = gameValues.remainingMathQuestion;
      storeToLocalStorage()
      }
}

// Waits until content in loaded to the dom.
document.addEventListener('DOMContentLoaded', function() {
  console.log(gameValues);
  let buttons = document.getElementsByTagName('button');
  const checkAnsButton = document.getElementById('checkAnswerButton');
  playButton ? playButton.style.display = 'none' :  null // Check if playButton is loaded.
  checkAnsButton && resetButton ? resetButton.insertAdjacentElement('beforebegin', checkAnsButton) : null;
  for (let button of buttons) {
    button.addEventListener('click', function() {
      if(this.getAttribute('data-type') === 'submit-game-values'){
        formSubmit()
      }else{
        throw `Error! Check that you have enter name and challenge amount.`
      }
    })
  };
});

/**
 * Navigates to game page and displays
 * intial gameValues: name, number math question, and first math question.
 * */
function formSubmit(event) {
  event.preventDefault()
  location.href = "game.html";
};



// Assigns and distructure getFromLocalStorge function and checks truthy value
let storedValues = getFromLocalStorage();
storedValues ? (gameValues = storedValues) : gameValues;

/** Creates random math equation  */
function generateMathProblem() {
  const operators = ['+', '-', '*', '/'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  const valOne = Math.floor(Math.random() * 12) + 1;
  const valTwo = Math.floor(Math.random() * 12) + 1;
  let equation;

  if (valOne < valTwo && (operator === '/' ||'-')) {
    equation = ` ${valTwo} ${operator} ${valOne} `;
  } else {
    equation = `${valOne} ${operator} ${valTwo}`;
  }

  // Evaluate the equation and check for a floating-point result
  const result = eval(equation);

  // Check if the result is a floating-point number with assistance of chatGPT: "(!Number.isInteger(result))"
  if (!Number.isInteger(result)) {
    return generateMathProblem();
  }

  return {equation, result};
}
