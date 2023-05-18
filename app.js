const btnOp1 = document.querySelector('.btn--option-1');
const btnOp2 = document.querySelector('.btn--option-2');
const btnOp3 = document.querySelector('.btn--option-3');
const btnOp4 = document.querySelector('.btn--option-4');
let btns = document.querySelectorAll('.btn');
const heading = document.querySelector('.heading');
const timerConatiner = document.querySelector('.timer-container');
const resultText = document.querySelector('.result-text');

const containerCard = document.querySelector('.card-container');
let cards = document.querySelectorAll('.card');
let cardSideBacks = document.querySelectorAll('.card__side-back');
////////////////////////////////////////////
const cardSet = [
  { name: 'card-1', id: 1 },
  { name: 'card-2', id: 2 },
  { name: 'card-3', id: 3 },
  { name: 'card-4', id: 4 },
  { name: 'card-5', id: 5 },
  { name: 'card-6', id: 6 },
];
let cardSet1 = cardSet.slice(0, 2).concat(cardSet.slice(0, 2));
let cardSet2 = cardSet.concat(cardSet);
let firstCard, secondCard, priviousSelect;
let finishGame = false;
let timerStart;

//game mode, 配對數量, 翻牌數量
let gameMode = 0,
  matched = 0,
  counter = 0;

//洗牌 (Fisher-Yates Shuffle)
/* 
使用方式：
將最後一張牌與前面的隨機一張牌互換，再從倒數第二張開始列推
*/
const shuffleCards = function (cardSet) {
  for (let i = cardSet.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]];
  }
};
//發牌（依選擇的模式）
const setCard = function (mode) {
  shuffleCards(mode === 4 ? cardSet1 : cardSet2);
  let count = 0;
  while (count < mode) {
    //card
    let card = document.createElement('div');
    card.classList.add('card');
    //card-front
    let cardSideFront = document.createElement('div');
    cardSideFront.className = 'card__side card__side-front';

    let cardFrontImage = document.createElement('div');
    cardFrontImage.className = 'card__image card__image-front';

    //card-back(different)
    let cardSideBack = document.createElement('div');
    cardSideBack.className = `card__side card__side-back card__side-back-${
      mode === 4 ? cardSet1[count].id : cardSet2[count].id
    }`;

    //Append child
    cardSideFront.appendChild(cardFrontImage);
    card.appendChild(cardSideFront);
    card.appendChild(cardSideBack);
    //dataSet
    card.dataset.name =
      mode === 4 ? cardSet1[count].name : cardSet2[count].name;

    containerCard.appendChild(card);
    count++;
  }
  cards = document.querySelectorAll('.card');
  cards.forEach((c) => c.addEventListener('click', (e) => flipCard(e)));
};

//計時
let time = 0;
const timer = document.querySelector('.time');
const getTime = function () {
  const tick = () => {
    let dSec = String(time % 10);
    let sec = String(Math.floor(time / 10) % 60).padStart(2, 0);
    let min = String(Math.floor(time / 600)).padStart(2, 0);

    timer.textContent = `${min}:${sec}.${dSec}`;
    if (finishGame) {
      clearInterval(setTimer);
    }
    time++;
  };
  tick();
  const setTimer = setInterval(tick, 100);
  return setTimer;
};

//開啟遊戲（依選擇的模式）
const playGame = function (mode) {
  time = 0;
  heading.classList.add('matched');
  timerConatiner.classList.remove('matched');
  resultText.classList.add('hide');
  finishGame = false;
  gameMode = mode;
  containerCard.classList.add(gameMode === 1 ? 'grid-2r-2c' : 'grid-3r-4c');
  setCard(gameMode === 1 ? 4 : 12);
  btns.forEach((b) => {
    b.classList.add('hide');
  });
  if (timerStart) clearInterval(timerStart);

  setTimeout((timerStart = getTime()), 1000);
};

//詢問重啟或回到主頁（不論如何，重設整個card）
const askRestart = function () {
  containerCard.className = 'card-container';
  containerCard.innerHTML = '';
  matched = 0;
  btnOp3.classList.remove('hide');
  btnOp4.classList.remove('hide');
};

//遊戲結束後選擇結果
const restartOrNot = function (select) {
  if (select === 1) {
    gameMode = 0;
    btns.forEach((b) => b.classList.toggle('hide'));
    resultText.classList.add('hide');
    heading.classList.remove('matched');
    timerConatiner.classList.add('matched');
  } else {
    playGame(gameMode);
  }
};

//reset 卡片選擇狀態
const resetCard = function (time) {
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    [firstCard, secondCard, priviousSelect] = [undefined, undefined, undefined];
    counter = 0;
  }, time);
};

//處理配對情況
const isMatched = function () {
  setTimeout(() => {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    [firstCard, secondCard, priviousSelect] = [undefined, undefined, undefined];
    counter = 0;
    matched += 1;
    if (matched === (gameMode === 1 ? 2 : 6)) {
      if (timerStart) clearInterval(timerStart);
      resultText.classList.remove('hide');
      finishGame = true;
      askRestart();
    }
  }, 200);
};

//確認是否配對
const matchCheck = function () {
  firstCard.dataset.name === secondCard.dataset.name
    ? isMatched()
    : resetCard(200);
};

//翻牌
const flipCard = function (e) {
  let targetCard = e.target.closest('.card');
  if (!targetCard || priviousSelect === targetCard) return;
  if (counter !== 2) {
    counter++;
    targetCard.classList.add('flip');
    counter === 1 ? (firstCard = targetCard) : (secondCard = targetCard);
    priviousSelect = targetCard;
    if (counter === 2) {
      matchCheck();
    }
  }
};

////////////////////////////////////////////
btnOp1.addEventListener('click', () => playGame(1));
btnOp2.addEventListener('click', () => playGame(2));
btnOp3.addEventListener('click', () => restartOrNot(1));
btnOp4.addEventListener('click', () => restartOrNot(2));
