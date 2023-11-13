// Starting game values
let gameValues = {
  playerName: '',
  remainingMathQuestion:0,
  answeredQuestion:  0,
  startingValue: 0,
  collectedAcorn: [],
 }

 // Messsage to be displayed the message bubble in the game page.
const gameMessage = {
  startGameMsg: 'Lets do this!',
  endGameMsg: `You did great! Have another go.`,
  playAgainMsg: 'Come on, let\'s play again!',
  corrAnsMsg:{
    cMsg1: 'Great, keep it up!',
    cMsg2: 'You rock!',
    cMsg3: 'You make it look easy!',
    cMsg4: 'Great another acorn!',

  },
  wrongAnsMsg: {
    wMsg1: 'You got this!',
    wMsg2: 'Take a deep breath and try again.',
    wMsg3: 'Take your time and give it one more try.',
    wMsg4: 'Good try! Give it another go.',
  }
}

/** 
 * Generates random message used to display message for correct and wrong answer
*/
function randomMsg(newMessage) {
  const correctMessages = Object.values(newMessage);
  const randomMessageIndex = Math.floor(Math.random() * correctMessages.length);
  const randMessage = correctMessages[randomMessageIndex]
  message.textContent = randMessage;
  message.setAttribute('aria-label', randMessage)// Applies screen reader to the text that is displayed
}


/** Gets stored gameValues{} stored in local storage */
function getFromLocalStorage(){
  const storedValues = localStorage.getItem(gameValues);
 return storedValues ? JSON.parse(storedValues) : undefined;
}

/** Stores gameValues obj to local storage */
function storeToLocalStorage(){
  localStorage.setItem(gameValues, JSON.stringify(gameValues))
}

/**
 * Handles/modifies players name: chapitalizes first letter and store in localstorage.
 * Displays name on home page in Instructions section.
 * */
 function handleNameInput() {
  const nameInput = document.getElementById('firstNameInput');
  const spanFirstName = document.getElementById('spanFirstName');
  if(nameInput){
    const firstNameValue = nameInput.value;
    const nameToLowerCase = firstNameValue.toLowerCase();
    const modifiedFirstName =  nameToLowerCase.charAt(0).toUpperCase() + nameToLowerCase.slice(1);
    spanFirstName.textContent = ` ${modifiedFirstName}`;
    gameValues.playerName = modifiedFirstName;
    
  }else{
    throw `No name was entered`;
  } 
}

/** Handels challenge input amount and store to localStorage */
function handleNumberInput(inputType) {
  if(inputType){
    gameValues.remainingMathQuestion = parseInt(inputType.value);// Converts string input to a number.
    gameValues.startingValue = gameValues.remainingMathQuestion;
    storeToLocalStorage()
  }else{
    throw `Input not valid! Ensure input value is a number.`
  }
}


// Assigns and distructure getFromLocalStorge function and checks truthy value
let storedValues = getFromLocalStorage();
storedValues ? (gameValues = storedValues) : gameValues;

/** Helper function that can take in more than one element using the spread operator to remove HTML element*/
function removeElement  (...element) {
  // Loops through ...element parameter using spread operator for mulitple elements
  element.forEach(element => {
    element.style.display = 'none'
  })
  }

/** Helper function that can take in more than one element using the spread operator to add HTML element*/
function addElement  (...element) {
  element.forEach(element => {
    element.style.display = 'block'
  })
  }


/**
 * Navigates to game page and displays and runs handleNumberInput()
 * */  
function formSubmit(event) {
  const totalInputValue = document.getElementById('totalInput'); 
  event.preventDefault()
  location.href = 'game.html';
  totalInputValue ? handleNumberInput(totalInputValue) : null;
  
};

/* Loads game values and intial math question as well as listens for game events: checkAswer,  */
document.addEventListener('DOMContentLoaded', function() {
  const playBtn = document.getElementById('playButton');
  const resetBtn = document.getElementById('resetButton');
  const checkAnswerBtn = document.getElementById('checkAnswerButton')
  removeElement(playBtn)
  resetBtn.insertAdjacentElement('beforebegin', checkAnswerBtn);
 game();
})


function game() {
  document.getElementById('questionsRemaining').innerText = gameValues.remainingMathQuestion;
  Object.assign(details,  generateMathProblem());
  document.getElementById('mathQuestion').textContent = `${details.equation} = `;
  document.getElementById('message').innerText = gameMessage.startGameMsg;
  console.log(gameValues)
  if (gameValues.answeredQuestion < gameValues.startingValue) {
    newMathEquation()
  }else{
    console.log('Game ended')
  }

}

function newMathEquation() {
  Object.assign(details,  generateMathProblem());
  document.getElementById('mathQuestion').textContent = `${details.equation} = `;
  document.getElementById('playerInput').value = '';
  document.getElementById('playerInput').focus();
  console.log(details.equation +  ' = ' + details.result)
}
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

// Obj to handel and update value from generateMathProblem enable to display new math problem.
const details = { equation: undefined, result: undefined}

/** Create acorns image and returns a list of acorn images for every right answer input. */
function addAcorn() {
  const acronImage = document.createElement('img');
    acronImage.classList.add('acorn-list-item');
    acronImage.src = './assets/images/acorn.webp';
    acronImage.ariaLabel = "Cartoon acorn";
  const acornListItem  = document.createElement('li');
    acornListItem.appendChild(acronImage);
    gameValues.collectedAcorn.push(acornListItem);
    
  return acornListItem;
}

/** Evaluates player input check if answer is correc, updates message
 *  from Nutty depending on the correctness of playerInput, and adds an acorn.
 * */
function checkAnswer() {
  const acorn = addAcorn();
  const acronUL = document.getElementById('acornUlList')
  const correctMsg = gameMessage.corrAnsMsg;
  const wrongMsg = gameMessage.wrongAnsMsg;

  if(playerInput.value == details.result && gameValues.remainingMathQuestion > 0){
    gameValues.remainingMathQuestion = gameValues.remainingMathQuestion - 1;
    gameValues.answeredQuestion = gameValues.answeredQuestion + 1;
    document.getElementById('questionsRemaining').textContent = gameValues.remainingMathQuestion;
  
    //Check if node/acorn-image has been applied
    if(acorn instanceof Node) {
      acronUL.appendChild(acorn);
    }
    randomMsg(correctMsg);
    newMathEquation();
    console.log( 'totalQuest', gameValues.remainingMathQuestion, gameValues)
  }else {
    setTimeout(() => {
      document.getElementById('message').textContent = `Enter the right answer to continue.`
    }, 4000);
   
    randomMsg(wrongMsg);
    playerInput.value = '';
  } 
 
}
