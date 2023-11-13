const displayMathQuestion = document.getElementById('mathQuestion');
const playerInput = document.getElementById('playerInput');
const totalMathProblems = document.getElementById('totalInput');
let message = document.getElementById('message');
const gameSubMessage = document.getElementById('gameSubMessage');

// Gobal Buttons
const playButton = document.getElementById('playButton');
const resetButton = document.getElementById('resetButton');
const checkAnsButton = document.getElementById('checkAnswerButton');


// starting game values
let gameValues = {
  playerName: '',
  remainingMathQuestion:0,
  answeredQuestion:  0,
  startingValue: 0,
  collectedAcorn: []
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
 * Navigates to game page and displays
 * intial gameValues: name, number math question, and first math question.
 * */
function formSubmit(event) {
  event.preventDefault()
  location.href = "game.html";
};

function newGameformSubmit(event) {
  event.preventDefault();
  displayNewQuestion();
}

document.addEventListener('DOMContentLoaded', function() {
  console.log(gameValues);
  let buttons = document.getElementsByTagName('button');
  const checkAnsButton = document.getElementById('checkAnswerButton');
  playButton ? playButton.style.display = 'none' :  null
  checkAnsButton && resetButton ? resetButton.insertAdjacentElement('beforebegin', checkAnsButton) : null;
  for (let button of buttons) {
    button.addEventListener('click', function() {
      if(this.getAttribute('data-type') === 'check-Answer-Submit'){
        checkAnswer()
      }else {
        displayNewQuestion()
      }     
    })
  } 
  document.getElementById('playButton').addEventListener('click', () => {
    removeElement(playButton, gameSubMessage, totalMathProblems);
    addElement(displayMathQuestion, playerInput, checkAnsButton, resetButton);
    resetButton.insertAdjacentElement('beforebegin', checkAnsButton);
    newGame()
  })
  playerInput.addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
      event.preventDefault()
      checkAnswer()
    }
  })

})

/**
 * Handles/modifies players name: chapitalizes first letter and store in localstorage.
 * Displays name on home page in Instructions section.
 * */
 function handleNameInput(){
  const nameInput = document.getElementById('firstNameInput');
  if(nameInput){
    const firstName = document.getElementById('spanFirstName');
    const fname = nameInput.value;
    const nameToLowerCase = fname.toLowerCase();
    const nameFirstLetrCap = nameToLowerCase.charAt(0).toUpperCase() + nameToLowerCase.slice(1);
    firstName.innerText = ` ${nameFirstLetrCap}`
    gameValues.playerName = nameFirstLetrCap
    storeToLocalStorage()
  }
}
handleNameInput()

/** Handels challenge input amount and store to localStorage */
function handleNumberInput(nameInput) {
  if(nameInput){
      gameValues.remainingMathQuestion = parseInt(nameInput.value)
      gameValues.startingValue = gameValues.remainingMathQuestion;
      storeToLocalStorage()
      }
}


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

// Obj to handel and update value from generateMathProblem enable to display new math problem.
const details = { equation: undefined, result: undefined}

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



/** Inserts starting gameValues to game page and inital math problem. */
// function displayStartVal() {
//     removeElement(totalMathProblems)
//     Object.assign(details,  generateMathProblem());
//     displayMathQuestion.textContent = `${details.equation} = `;
//     console.log(details.equation +  ' = ' + details.result)
//     questionRemainingText.innerText = gameValues.remainingMathQuestion;
//     message.innerText= gameMessage.startGameMsg;
//     storeToLocalStorage();
// }

function newGame() {
  removeElement(playButton, gameSubMessage, totalMathProblems);
  addElement(displayMathQuestion, playerInput, checkAnsButton, resetButton);
  displayNewQuestion()
  storeToLocalStorage()
  resetButton.insertAdjacentElement('beforebegin', checkAnsButton);
  questionRemainingText.innerText = gameValues.remainingMathQuestion;
  console.log('newGame', gameValues);
  playerInput.value = '';
   gameSubMessage.innerText = 'test second game'
}

/** Displays new math question when answered correctly,
 *  updates the displays a new math question, and messages.
 * */
function displayNewQuestion() {
  const numberOfAcorns = gameValues.collectedAcorn.length;
    // if (gameValues.answeredQuestion < gameValues.startingValue) {
      Object.assign(details,  generateMathProblem());
      displayMathQuestion.innerHTML = `${details.equation} = `;
      playerInput.value = '';
      playerInput.focus();
      console.log(details.equation +  ' = ' + details.result)
    // } else {
    //   removeElement(playerInput, displayMathQuestion, resetButton, checkAnsButton)
    //   questionRemainingText.textContent = 0;
    //   gameValues.startingValue = 0;
    //   gameValues.answeredQuestion = 0;
    //   gameSubMessage.innerText = gameMessage.endGameMsg;
    //   message.textContent = `Great job! You collected ${numberOfAcorns} acorns.`;
    //   setTimeout(() => {
    //       const playButton = document.getElementById('playButton');
    //       removeElement(checkAnsButton);
    //       addElement(resetButton, playButton, totalMathProblems);
    //       resetButton.insertAdjacentElement('beforebegin', playButton);
    //       gameSubMessage.innerText = `Enter new challange and press, Play!`;
    //       totalMathProblems.value = ''
    //       gameValues.startingValue = 0;
    //       gameValues.answeredQuestion = 0;
    //   }, 3000);
      
    // }
}

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
  const questionRemainingText = document.getElementById('questionRemainingText');
  const correctMsg = gameMessage.corrAnsMsg;
  const wrongMsg = gameMessage.wrongAnsMsg;

  if(playerInput.value == details.result && gameValues.remainingMathQuestion > 0){
    gameValues.remainingMathQuestion = gameValues.remainingMathQuestion - 1;
    gameValues.answeredQuestion = gameValues.answeredQuestion + 1;
    questionRemainingText.textContent = gameValues.remainingMathQuestion;
  
    //Check if node/acorn-image has been applied
    if(acorn instanceof Node) {
      acronUL.appendChild(acorn);
    }
    randomMsg(correctMsg);
    displayNewQuestion();
    console.log( 'totalQuest', gameValues.remainingMathQuestion, gameValues)
  }else {
    setTimeout(() => {
      message.textContent = `Enter the right answer to continue.`
    }, 4000);
   
    randomMsg(wrongMsg);
    playerInput.value = '';
  } 
 
}

/** Rest all starting values and returns to home page */
function reset() {
  location.href = 'index.html';
  localStorage.clear()
}
