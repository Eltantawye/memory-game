

// Shuffle function from http://stackoverflow.com/a/2450976
// get the classes of cards
const myList = document.querySelectorAll('.fa');
const stars = document.getElementsByClassName('fa fa-star');
const timer = document.querySelector('.timer');
const gameBoard = document.querySelector('.container');
const popup = document.querySelector('.popup');
const resetBtn = document.querySelector('.fa.fa-repeat');
let gameShapes = [];
let moves = 0;
let score = 0;
let timeIsActive = 0;
let wrongMoves = 0;
let clickedArr = [];
let winCondition = 0;
// Store all classes in myList and gamesShapes array
for(let i = 0 , Garr=0 ; i < myList.length ; i++){
  if(myList[i].className !== 'fa fa-star' &&myList[i].className !== 'fa fa-repeat'){
    gameShapes[Garr] = myList[i].className;
    Garr++;
  }
}
// shuffle function
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

const shuffledShapes = shuffle(gameShapes);
/* change shapes function
*set all shufled shapes(cards) into game board
*/
function changeShapes(array){
  for(let i = 0 ,shapeCounter = 0 ; i < myList.length ; i++){
    if(myList[i].className !== 'fa fa-star' &&myList[i].className !== 'fa fa-repeat'){
    myList[i].setAttribute('class',array[shapeCounter]);
    shapeCounter++;
    }
  }
}
changeShapes(shuffledShapes);
/* logical function takes user's click event and check if two cards are matchd
* user can not click on matched card or showen card
*/
function checkCards(event){
    if(event.target.nodeName ==='LI' && !event.target.classList.contains('match') && !event.target.classList.contains('show')){ // checking card
      timerSpan(timeIsActive);
      let item = event.target.firstElementChild.className;
      //push clicked card classes into clickedArr
      clickedArr.push(item);
      //show card
      event.target.classList.toggle('open');
      event.target.classList.toggle('show');
      // checking two cards
      if(clickedArr.length > 1){
        let clickedCards=[];
        if(clickedArr[0] === clickedArr[1] && event.target.classList.contains('open')){
          ++moves;
          score+=10;
          scorePanel(moves,score);
          //add match class to matched cards
          clickedCards = document.getElementsByClassName(clickedArr[0]);
          for(let i = 0 ; i < clickedCards.length ; i++){
            clickedCards[i].parentElement.classList.add('match');
          }
          winCondition++;
          clickedCards=[];
          if(winCondition === 8){
            stopTimer();
            popupDisplay();
          }
        }//end if
        else  {
          let firstCard,secondCard;
          clickedCards = [document.getElementsByClassName(clickedArr[0]) , document.getElementsByClassName(clickedArr[1])];
          firstCard = clickedCards[0][0].parentElement.classList.contains('open') ? clickedCards[0][0] : clickedCards[0][1];
          secondCard = clickedCards[1][0].parentElement.classList.contains('open') ? clickedCards[1][0] : clickedCards[1][1];
          ++moves;
          ++wrongMoves;
          scorePanel(moves,score);
          starCounter(wrongMoves);
          firstCard.parentElement.classList.add('not-matched','show');
          secondCard.parentElement.classList.add('not-matched','show');
          setTimeout(function(){
            firstCard.parentElement.classList.remove('open','show','not-matched');
            secondCard.parentElement.classList.remove('open','show','not-matched');
          }, 1100);
        } // end else
        clickedArr=[];
      }//end more than 2 cards condition
  }
}//end of function

/*score panel function
*takes number of moves to handle score , stars and number of moves
*/
function scorePanel(NumberOfMoves,score) {
  const movesCounter = document.querySelector('.moves');
  const scoreCounter = document.querySelector('.score');
  movesCounter.textContent = NumberOfMoves;
  scoreCounter.textContent = score;
}

/* stars function reduces number of stars
*it takes number of wrongMoves as attribute
*every 9 wrong moves 1 star will removed , 1 star is the minimum rating
*/
function starCounter(wrongMvs){
  let starsArr = [],starsC = 0 ;
  for(let i = 0 ; i < stars.length ; i++){
    starsArr[i]=stars[i];
  }
  if(wrongMvs > 8 && starsArr.length > 1) {
    starsArr[starsC].remove();
    wrongMoves = 0;
    starsC++;
  }
}

/*Reset function
*used to reset all game board,moves,score and stars
*remove game classes from cards like match class
*shuffle cards
*/
function reset(){
  for(let i = 0 ; i < myList.length ; i++){
    if(myList[i].className !== 'fa fa-star' &&myList[i].className !== 'fa fa-repeat'){
      myList[i].parentElement.classList.remove('match','open','show');
    }}
    moves = 0;
    score = 0;
    wrongMoves = 0;
    clickedArr = [];
    winCondition = 0;
    scorePanel(moves ,score);
    shuffle(shuffledShapes);
    changeShapes(shuffledShapes)
    const newStar = document.createElement('li');
    newStar.innerHTML = '<i class="fa fa-star"></i>';
    const starList = document.querySelector('.stars');
    for(let i = stars.length ; i< 3 ; i++){
      starList.appendChild(newStar);
    }
    resetTimer();
}
/* timer function with add seconds function
*/
let sec = 0;
let t;
function addSec(){
  sec++;
  timer.textContent=sec+' ';
  t=setTimeout(addSec,1000);
}

function timerSpan(act){
    if(!act){
      timeIsActive= 1;
      addSec();
    }
}

/*reset timer function
*reset timer to 0 after clicking on reset button
*/
function resetTimer(){
  clearTimeout(t);// to stop setTimeout
  sec = 0;
  timer.textContent = '00 ';
  timeIsActive = 0;
}

/*stop time after winning condition */
function stopTimer(){
  clearTimeout(t);
  timeIsActive = 0;
}

/* pop up messege function
*it shows game score , number of moves and star Rating
*play agin button
*/
function popupDisplay() {
  const popScore = document.querySelector('.popScore');
  const popTimer = document.querySelector('.popTimer');
  const popStars = document.querySelector('.popStars');
  const popBtn = document.querySelector('.popBtn');
  popScore.textContent = score;
  popTimer.textContent =sec;
  popStars.textContent = stars.length;
  gameBoard.classList.add('overlay');
  popup.style.display = 'block';
  //when user clicks on play again button
  popBtn.addEventListener('click', function(){
    reset();
    gameBoard.classList.remove('overlay');
    popup.style.display = 'none';
  });
  // when user clicks outside the popup box
  window.addEventListener('click',function(event){
  if(event.target == gameBoard) {
    gameBoard.classList.remove('overlay');
    popup.style.display = 'none';
    }
  });
}

document.querySelector('.deck').addEventListener('click',checkCards);
resetBtn.addEventListener('click',reset);
