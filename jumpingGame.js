"use strict";
const canvas = document.getElementById("gameCanvas");
const cWidthOfCanvas = 600; //px
const cHeightOfCanvas = 150; //px

if (!canvas.getContext) {
  alert("Your browser don't support the canvas element.");
}

const ctx = canvas.getContext("2d");

const cLandLevelOnY_v1 = 138; //px
const cJumpLevelOnY = 80; //px;
const PLAYER_X_POSITION = 50,
  PLAYER_X_DELTA = 10,
  PLAYER_Y_HANDS_LEVEL = 20;

function getPLAYER_END_POINTS(y) {
  return [
    new Point(PLAYER_X_POSITION - PLAYER_X_DELTA, y),
    new Point(PLAYER_X_POSITION + PLAYER_X_DELTA, y),
    new Point(PLAYER_X_POSITION - PLAYER_X_DELTA, y - PLAYER_Y_HANDS_LEVEL),
    new Point(PLAYER_X_POSITION + PLAYER_X_DELTA, y - PLAYER_Y_HANDS_LEVEL),
  ];
}

function drawThePlayer(x = PLAYER_X_POSITION, y = cLandLevelOnY_v1) {
  ctx.beginPath();
  ctx.arc(x, y - 40, 10, 0, Math.PI * 2, true);
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x - PLAYER_X_DELTA, y);
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x + 10, y);
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x, y - 30);
  ctx.moveTo(x - PLAYER_X_DELTA, y - PLAYER_Y_HANDS_LEVEL);
  ctx.lineTo(x + PLAYER_X_DELTA, y - PLAYER_Y_HANDS_LEVEL);
  ctx.stroke();
}

function clearPlayerPartOfCanvas(y) {
  const cWidthOfPlayer = 22;
  const cHeightOfPlayer = 52;
  const x0 = PLAYER_X_POSITION - PLAYER_X_DELTA - 1; //starting point of Player;
  ctx.clearRect(x0, y - 51, cWidthOfPlayer, cHeightOfPlayer);
}

let jumpLevel = cLandLevelOnY_v1;
const cPlayerStep = 3;
let gameStopped = true;
let keyUpTimerId;
let score;
const speedOfGame = 15;

function movePlayer(step = 1) {
  clearPlayerPartOfCanvas(jumpLevel);
  jumpLevel += step;
  drawThePlayer(PLAYER_X_POSITION, jumpLevel);
}

function keyDownEvent(event) {
  if (event.code == "Space") {
    if (gameStopped) return;

    if (jumpLevel > cJumpLevelOnY) {
      movePlayer(-cPlayerStep);
    }
  } else if (event.code == "Enter" && gameStopped) {
    startGame();
  } else if (event.code == "Escape" && !gameStopped) {
    gamePause();
  }
  // console.log(event.code);
  // console.log(`keyDown event (gameStopped = ${gameStopped})`);
}

function clearKeyUpTimer() {
  if (keyUpTimerId) clearTimeout(keyUpTimerId);
  keyUpTimerId = null;
}

function movePlayerDown() {
  if (gameStopped) {
    clearKeyUpTimer();
    return;
  }
  movePlayer(cPlayerStep);
  // console.log("movePlayer Down");
  if (jumpLevel < cLandLevelOnY_v1) {
    keyUpTimerId = setTimeout(movePlayerDown, 1);
  } else {
    // console.log("movePlayerDown: clearTimeout");
    clearKeyUpTimer();
  }
}

function keyUpEvent(event) {
  if (gameStopped) return;
  if (event.code == "Space") {
    keyUpTimerId = setTimeout(movePlayerDown, 1);
    // console.log("keyUp event");
  }
}

document.addEventListener("keydown", keyDownEvent);
document.addEventListener("keyup", keyUpEvent);

const cRoadY = 140;
let animateX = cWidthOfCanvas;
let gameDuration = 0;

function drawRoad() {
  ctx.beginPath();
  ctx.moveTo(0, cRoadY);
  ctx.lineTo(cWidthOfCanvas, cRoadY);
  ctx.stroke();
}

const cRadiusT = 15;
const cTrank = 10;
let treesArr = [0, 200, 400, 600];
let treesType = treesArr.map(() => getRandomInt(2));

function isInCanvasArea(x) {
  return x < -(cRadiusT * 2) || x > cWidthOfCanvas + cRadiusT * 2;
}

function drawTree(x, y, radius = cRadiusT, isBigTree = false) {
  let k = 1;

  if (isBigTree) k = 1.3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - cTrank * k - radius * k);
  ctx.stroke();
  const startAngleT = (Math.PI / 180) * 135;
  const endAngleT = (Math.PI / 180) * 45;
  let y1 = y - cTrank * k - radius * Math.sin(startAngleT);
  ctx.moveTo(x, y1);
  radius *= k;
  ctx.arc(x, y1, radius, startAngleT, endAngleT);
  ctx.fill();

  function isCollision(arrOfPoints) {
    for (let i = 0; i < arrOfPoints.length; i++) {
      if (ctx.isPointInPath(arrOfPoints[i].x, arrOfPoints[i].y)) return true;
    }
    return false;
  }

  let treeXstart = x - radius,
    treeXend = x + radius;
  if (
    (PLAYER_X_POSITION - PLAYER_X_DELTA <= treeXstart &&
      PLAYER_X_POSITION + PLAYER_X_DELTA >= treeXstart) ||
    (PLAYER_X_POSITION - PLAYER_X_DELTA <= treeXend &&
      PLAYER_X_POSITION + PLAYER_X_DELTA >= treeXend)
  ) {
    if (isCollision(getPLAYER_END_POINTS(jumpLevel))) gameOver();
  }
  if (treeXend === PLAYER_X_POSITION - PLAYER_X_DELTA - 1) score += 10;
  ctx.clearRect(500, 30, 100, 40);
  writeTextToCanvas(`Score: ${score}`, 14, 500, 40);
}

function drawTrees(x0) {
  for (let i = 0; i < treesArr.length; i++) {
    let addTree = treesType[i];
    drawTree(x0 + treesArr[i], cRoadY);
    if (addTree) {
      drawTree(x0 + treesArr[i] + cRadiusT * 2, cRoadY);
    }
  }
}

function clearTrees(x0) {
  function clearTree(x, y, radius) {
    ctx.clearRect(
      x - radius,
      y - cTrank - radius * 2,
      radius * 2,
      cTrank + radius * 2
    );
  }

  let y = cRoadY - 1;

  for (let i = 0; i < treesArr.length; i++) {
    let addTree = treesType[i];
    clearTree(x0 + treesArr[i], y, cRadiusT);
    if (addTree) {
      clearTree(x0 + treesArr[i] + cRadiusT * 2, y, cRadiusT);
    }
  }
}

function animateTrees() {
  ctx.clearRect(500, 5, 100, 40);
  let timeVal = gameDuration / 1000;
  writeTextToCanvas(`time: ${timeVal.toFixed(3)} s`, 14, 500, 20);
  gameDuration += speedOfGame;
  clearTrees(animateX);
  animateX--;
  drawTrees(animateX);
  if (animateX < -(cWidthOfCanvas + cRadiusT * 2 + 30))
    animateX = cWidthOfCanvas;

  // console.log(animateX);
}

function draw() {
  drawRoad();
  drawThePlayer();
}

function writeTextToCanvas(text, fontSize = 28, x = 100, y = 30) {
  ctx.font = `${fontSize}px serif`;
  ctx.fillText(text, x, y);
}

function getSpeedOfTheGame() {
  return +document.querySelector('input[name="speedLevel"]:checked').value;
}

//This functions is used in animation
let timerId;

function startInterval() {
  timerId = setInterval(animateTrees, speedOfGame);
}

function stopInterval() {
  clearInterval(timerId);
  // console.log("Interval stopped.");
}

function clearAllCanvas() {
  ctx.clearRect(0, 0, cWidthOfCanvas, cHeightOfCanvas);
}

function startGame() {
  animateX = cWidthOfCanvas;
  jumpLevel = cLandLevelOnY_v1;
  score = 0;
  gameDuration = 0;
  clearAllCanvas();
  draw();
  runGame();
  // console.log("startGame");
}

function clearTextInfoOnCanvas() {
  ctx.clearRect(100, 0, 400, 100);
}

function runGame() {
  startInterval();
  gameStopped = false;
  clearTextInfoOnCanvas();
}

function gameOver() {
  stopInterval();
  gameStopped = true;
  drawThePlayer(PLAYER_X_POSITION, jumpLevel); //delete!
  writeTextToCanvas("Game over.");
  writeTextToCanvas("Press 'Enter' key to start again.", 21, 100, 70);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}
