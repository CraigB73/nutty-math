// Global Variables
const totalMathProblems = document.getElementById('totalInput');
const remainingQuestions = document.getElementById('remainingQuestionNum');
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
    wMsg3: 'Take your time. Give it one more try.',
    wMsg4: 'You\'re wrong this answer belongs to another math problem.',
  }
}

/** Generates random message from and attaches aria-label for displayed message: 
 * used to display message for correct and wrong answer*/
function randomMsg(newMessage) {
  const message = document.getElementById('message');
  const correctMessages = Object.values(newMessage);
  const randomMessageIndex = Math.floor(Math.random() * correctMessages.length);
  const randMessage = correctMessages[randomMessageIndex]
  message.textContent = randMessage;
  message.setAttribute('aria-label', randMessage);
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
 * Handles/modifies players name: chapitalizes first letter and store in localstorage.
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
  const playButton = document.getElementById('playButton');
  const resetButton = document.getElementById('resetButton');
  playButton ? playButton.style.display = 'none' :  null // Check if playButton is loaded.
  checkAnsButton && resetButton ? resetButton.insertAdjacentElement('beforebegin', checkAnsButton) : null;
  for (let button of buttons) {
    button.addEventListener('click', function() {
      if(this.getAttribute('data-type') === 'submit-game-values'){  
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
  displayStartingInfo();
  
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
// Obj to handel and update value from generateMathProblem enable to display new math problem.
const details = { equation: undefined, result: undefined}
/** Helper function that can take in more than one element using the spread operator to remove HTML element*/
function removeElement  (...element) {
  // Loop through element parameter(s) uses spread operator if there is more than one element
  element.forEach(element => {
    element.style.display = 'none'
  });
  };

/** Helper function that can take in more than one element using the spread operator to remove HTML element*/
function removeElement  (...element) {
  // Loops through ...element parameter using spread operator for mulitple elements
  element.forEach(element => {
    element.style.display = 'none'
  });
};

/** Helper function that can take in more than one element using the spread operator to add HTML element*/
function addElement  (...element) {
   // Loops through ...element parameter using spread operator for mulitple elements
  element.forEach(element => {
    element.style.display = 'block'
  })
  } 

/** Inserts starting gameValues to game page and inital math problem. */
function displayStartingInfo() {
  if(gameValues.remainingMathQuestion >= 5) {
    Object.assign(details,  generateMathProblem());
    document.getElementById('mathQuestion').textContent = `${ details.equation} = `;
    console.log(details.equation +  ' = ' + details.result)
    remainingQuestions.innerText = gameValues.remainingMathQuestion;
    document.getElementById('message').textContent = gameMessage.startGameMsg;
    console.log(remainingQuestions)
  }else {
    console.log('error')
  }
};

/** Displays new math question when answered correctly
 *  and updates the displays a new math question.
 * */
function displayNewQuestion() {
  const numberOfAcorns = gameValues.collectedAcorn.length;
  const gameSubMessage = document.getElementById('gameSubMessage');
  const mathQuestion = document.getElementById('mathQuestion')
    if (gameValues.answeredQuestion < gameValues.startingValue) {
      Object.assign(details,  generateMathProblem());
      mathQuestion.innerHTML = `${details.equation} = `;
      playerInput.value = '';
      playerInput.focus();
      console.log(details.equation +  ' = ' + details.result)
    } else {
      removeElement(playerInput, mathQuestion, resetButton, checkAnsButton)
      questionRemainingText.textContent = 0;
      gameValues.startingValue = 0;
      gameValues.answeredQuestion = 0;
      gameSubMessage.innerText = gameMessage.endGameMsg;
      message.textContent = `Great job! You collected ${numberOfAcorns} acorns.`;
      setTimeout(() => {
          const resetButton = document.getElementById('resetButton')
          const playButton = document.getElementById('playButton');
          removeElement(checkAnsButton);
          addElement(resetButton, playButton, totalMathProblems);
          resetButton.insertAdjacentElement('beforebegin', playButton);
          numberOfAcorns > 0 ? gameSubMessage.innerText = `Enter new challange and press, Play!`: undefined; 
          totalMathProblems.value = ''
          gameValues.startingValue = 0;
          gameValues.answeredQuestion = 0;
      }, 3000);
    }
}
/** Create acorns image and returns a list of arcon images for every right answer input. */
function addAcron() {
  const acronImage = document.createElement('img');
    acronImage.src = './assets/images/acorn.webp';
    acronImage.style.width = '30px'
    acronImage.ariaLabel = "Cartoon acorn";
  const acornListItem  = document.createElement('li');
  acornListItem.appendChild(acronImage);
  gameValues.collectedAcorn.push(acornListItem)
  return acornListItem;
}


function reset() {
  location.href = 'index.html';
  localStorage.clear()
}
