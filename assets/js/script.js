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
    const nameFirstLetrCap = nameToLowerCase.charAt(0).toUpperCase() + nameToLowerCase.slice(1);
    firstName.innerText = ` ${nameFirstLetrCap}`
    gameValues.playerName = nameFirstLetrCap
    storeToLocalStorage()
  }
};

handleNameInput();

function handleNumberInput(nameInput) {
  if(nameInput){
      gameValues.remainingMathQuestion = parseInt(nameInput.value)
      gameValues.startingValue = gameValues.remainingMathQuestion;
      storeToLocalStorage()
      }
}
