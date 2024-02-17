"use strict";
const canvas = document.getElementById("gameCanvas");
const cWidthOfCanvas = 600; //px
const cHeightOfCanvas = 150; //px

if (!canvas.getContext) {
  alert("Your browser don't support the canvas element.");
}

const ctx = canvas.getContext("2d");

const cLandLevelOnY = 88; //px
const cJumpLevelOnY = 18; //px;

function drawThePlayer(y = cLandLevelOnY) {
  ctx.beginPath();
  ctx.moveTo(60, y);
  ctx.arc(50, y, 10, 0, Math.PI * 2, true);
  ctx.moveTo(50, y + 10);
  ctx.lineTo(50, y + 30);
  ctx.lineTo(40, y + 40);
  ctx.moveTo(50, y + 30);
  ctx.lineTo(60, y + 40);
  ctx.moveTo(40, y + 22);
  ctx.lineTo(60, y + 22);
  ctx.stroke();
}

function clearPlayerPartOfCanvas(y) {
  const cWidthOfPlayer = 22;
  const cHeightOfPlayer = 52;
  const x0 = 39; //starting point of Player;
  ctx.clearRect(x0, y - 11, cWidthOfPlayer, cHeightOfPlayer);
}

let jumpLevel = cLandLevelOnY;
const cPlayerStep = 1;
let gameStopped = true;

function movePlayer(step = 1) {
  clearPlayerPartOfCanvas(jumpLevel);
  jumpLevel += step;
  drawThePlayer(jumpLevel);
}

function testMovePlayerUp() {
  while (jumpLevel > cJumpLevelOnY) {
    movePlayer(-cPlayerStep);
  }
}

function keyDownEvent(event) {
  if (event.code == "Space") {
    if (gameStopped) {
      runGame();
    } else {
      if (jumpLevel > cJumpLevelOnY) {
        movePlayer(-cPlayerStep);
      }
    }
  } else if (event.code == "Enter" && gameStopped) {
    startGame();
  } else if (event.code == "Escape" && !gameStopped) {
    gamePause();
  }
  console.log(event.code);
  console.log(`keyDown event (gameStopped = ${gameStopped})`);
}

let keyUpTimerId;
const speedOfGame = 10; //getSpeedOfTheGame()

function movePlayerDown() {
  movePlayer(cPlayerStep);
  console.log("movePlayer Down");
  if (jumpLevel < cLandLevelOnY) {
    keyUpTimerId = setTimeout(movePlayerDown, speedOfGame);
  } else {
    console.log("movePlayerDown: clearTimeout");
    clearTimeout(keyUpTimerId);
  }
}

function keyUpEvent(event) {
  if (event.code == "Space") {
    keyUpTimerId = setTimeout(movePlayerDown, speedOfGame);
    console.log("keyUp event");
  }
}

document.addEventListener("keydown", keyDownEvent);
document.addEventListener("keyup", keyUpEvent);

const cRoadY = 140;
let animateX = cWidthOfCanvas;

function drawRoad() {
  ctx.beginPath();
  ctx.moveTo(0, cRoadY);
  ctx.lineTo(cWidthOfCanvas, cRoadY);
  ctx.stroke();
}

const cRadiusT = 15;
let treesArr = [0, 200, 400, 600];
let treesType = treesArr.map((x) => getRandomInt(2));

function isInCanvasArea(x) {
  return x < -(cRadiusT * 2) || x > cWidthOfCanvas + cRadiusT * 2;
}

function drawTrees(x0) {
  function drawTree(x, y, radius = cRadiusT) {
    ctx.beginPath();
    ctx.moveTo(x, y); //220, 140
    ctx.lineTo(x, y - 30);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y - 30, radius, (Math.PI / 180) * 135, (Math.PI / 180) * 45);
    ctx.fill();
  }

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
    ctx.clearRect(x - radius, y - 45, radius * 2, 30 + radius);
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
  clearTrees(animateX);
  animateX--;
  drawTrees(animateX);
  if (animateX < -(cWidthOfCanvas + cRadiusT * 2)) animateX = cWidthOfCanvas;
  console.log(animateX);
}

function draw() {
  drawRoad();
  drawThePlayer();
}

function writeTextToCanvas(text, x = 100, y = 30) {
  ctx.font = "28px serif";
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
  console.log("Interval stopped.");
}

function clearAllCanvas() {
  ctx.clearRect(0, 0, cWidthOfCanvas, cHeightOfCanvas);
}

function startGame() {
  animateX = cWidthOfCanvas;
  clearAllCanvas();
  draw();
  // testMovePlayerUp(); //Delete this instruction!!!
  runGame();
  console.log("startGame");
}

function clearTextInfoOnCanvas() {
  ctx.clearRect(100, 0, 400, 100);
}

function runGame() {
  startInterval();
  gameStopped = false;
  clearTextInfoOnCanvas();
}

function gamePause() {
  stopInterval();
  gameStopped = true;
  writeTextToCanvas("Game on pause.");
  writeTextToCanvas("Press space key to continue.", 100, 70);
  console.log("gamePause");
}

function gameOver() {
  stopInterval();
  gameStopped = true;
  writeTextToCanvas("Game over.");
  writeTextToCanvas("Press any key to start again.", 100, 70);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// window.main = () => {
//   window.requestAnimationFrame(main);
//   animateTrees();
//   console.log(`animateX: ${animateX}`);
// };
// main();
