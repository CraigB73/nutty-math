// Starting game values
let gameValues = {
  playerName: '',
  remainingMathQuestion:0,
  correct:  0,
  wrong: 0,
  startingValue: 0,
  score : {collectedAcorn: 0},
 }

 // Messsage to be displayed the message bubble in the game page.
const gameMessage = {
  startGameMsg: 'Lets do this!',
  endGameMsg: `You did great. Have another go!`,
  playAgainMsg: 'Come on, let\'s play again!',
  corrAnsMsg:{
    cMsg1: 'Great, keep it up!',
    cMsg2: 'You rock!',
    cMsg3: 'You make it look easy!',
    cMsg4: 'Great another acorn!',

  },
  wrongAnsMsg: {
    wMsg1: 'Give this one a go!',
    wMsg2: 'Take a deep breath and try again.',
    wMsg3: 'Try this question.',
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
  nuttyMessage.textContent = randMessage;
  nuttyMessage.setAttribute('aria-label', randMessage)// Applies screen reader to the text that is displayed
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
    element ? element.style.display = 'none' : null;
  })
  }

/** Helper function that can take in more than one element using the spread operator to add HTML element*/
function addElement  (...element) {
  element.forEach(element => {
    element ? element.style.display = 'block' : null;
  })
  }

/**
 * Navigates to game page and displays and runs handleNumberInput()
 * */  
function formSubmit(event) {
  const totalInputValue = document.getElementById('totalInput'); 
  event.preventDefault()
  console.log(location)
  totalInputValue ? handleNumberInput(totalInputValue) : null;
  console.log(event)
  location.href = event.target.action;
  
};

/* Loads game values and intial math question as well as listens for game events: checkAswer,  */
document.addEventListener('DOMContentLoaded', function() {
  const playBtn = document.getElementById('playButton');
  const resetBtn = document.getElementById('resetButton');
  const checkAnswerBtn = document.getElementById('checkAnswerButton');
  const playerInput = document.getElementById('playerInput'); 
  const acronUL = document.getElementById('acornUlList');
  removeElement(playBtn)
  resetBtn ? resetBtn.insertAdjacentElement('beforebegin', checkAnswerBtn) : null;
   Array.from({length:gameValues.score.collectedAcorn}).forEach(() => {
    acronUL.appendChild( createAcorn()) 
  })
  console.log(gameValues)
  game();
  if(playerInput){
    playerInput.addEventListener('keypress', (event) => {
      if(event.key === 'Enter') {
        checkAnswer()
      }
    })
    return; 
  }
  
  
  
})

function game() {
  const remainingQuestion = document.getElementById('questionsRemaining')
  const mathQuestion = document.getElementById('mathQuestion');
  const nuttyMessage = document.getElementById('nuttyMessage');
  Object.assign(details,  generateMathProblem());

  if(remainingQuestion || mathQuestion || nuttyMessage){
    document.getElementById('totalInput').style.display = 'none';
    remainingQuestion.innerText = gameValues.remainingMathQuestion;
    mathQuestion.textContent = `${details.equation} = `;
    nuttyMessage.innerText = gameMessage.startGameMsg;
  }
}

function endGame() {
  const playBtn = document.getElementById('playButton');
  const resetBtn = document.getElementById('resetButton');
  const checkAnswerBtn = document.getElementById('checkAnswerButton');
  const message = document.getElementById('gameMessage');
  const totalInputValue = document.getElementById('totalInput');
  removeElement(playerInput, mathQuestion);
  message.innerText = 'Keep gather! Choose your next challange';
  if(gameValues.remainingMathQuestion === 0){
    removeElement(checkAnswerBtn);
    addElement(playBtn, totalInputValue );
    setTimeout(() =>{ gameValues.correct > 0 ?  nuttyMessage.innerText = gameMessage.endGameMsg : nuttyMessage.innerText = 'Sorry better luck next time!';
   } , 3000)
    // numberOfAcorns ===  0 ? nuttyMessage.textContent = `Sorry! You collected ${null} acorns this time.`
    // : nuttyMessage.textContent = `Great job! You collected ${numberOfAcorns} acorns.`   
    resetBtn ? resetBtn.insertAdjacentElement('beforebegin', playBtn) : null;
  }

}

function newMathEquation() {
  const mathQuestion = document.getElementById('mathQuestion');
  const playersAnswer = document.getElementById('playerInput');
  Object.assign(details,  generateMathProblem());
  if(gameValues.remainingMathQuestion > 0){
    playersAnswer.value;
    playersAnswer.focus();
    mathQuestion.textContent = `${details.equation} = `;
    console.log(details.equation +  ' = ' + details.result)
  }else {
    endGame()
  }
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
function createAcorn() {
  const acronImage = document.createElement('img');
    acronImage.classList.add('acorn-list-item');
    acronImage.src = './assets/images/acorn.webp';
    acronImage.ariaLabel = "Cartoon acorn";
  const acornListItem  = document.createElement('li');
    acornListItem.appendChild(acronImage);
    
    
  return acornListItem;
}

/** Evaluates player input check if answer is correc, updates message
 *  from Nutty depending on the correctness of playerInput, and adds an acorn.
 * */
function checkAnswer() {
  const playerInput = document.getElementById('playerInput');
  nuttyMessage.innerText = `Enter a number or press "Enter"`
  if(playerInput.value == details.result){
    correctAnswer()
    playerInput.value = '';
  }else {
    wrongAnswer()
    playerInput.value = '';
  }
  newMathEquation()
}

/**
 * Evaluates if player answer input is truthy then
 * updates the dom: Nutty's message, remaining math questions and 
 * displays an acron.
 */
function correctAnswer() {
  const acorn = createAcorn();
  const correctMsg = gameMessage.corrAnsMsg;
  const acronUL = document.getElementById('acornUlList');
    randomMsg(correctMsg);
    gameValues.remainingMathQuestion = gameValues.remainingMathQuestion - 1;
    gameValues.correct = gameValues.correct + 1;
    document.getElementById('questionsRemaining').textContent = gameValues.remainingMathQuestion;

   //Check if node/acorn-image has been applied
   gameValues.score.collectedAcorn++; 
   acorn instanceof Node ? acronUL.appendChild(acorn) : acronUL ;
   console.log('correct')
   console.log( 'totalQuest', gameValues.remainingMathQuestion, gameValues)
};

/**
 * Evaluates if player answer input is falsey
 * updates the dom message and displays new math question.
 */
function wrongAnswer() {
  const wrongMsg = gameMessage.wrongAnsMsg; 
  randomMsg(wrongMsg);
  gameValues.remainingMathQuestion = gameValues.remainingMathQuestion - 1;
  gameValues.wrong = gameValues.wrong+ 1;
  document.getElementById('questionsRemaining').textContent = gameValues.remainingMathQuestion;
  console.log( 'totalQuest', gameValues.remainingMathQuestion, gameValues)
};

/** Rest all starting values and returns to home page */
function reset() {
  location.href = 'index.html';
  localStorage.clear()
}