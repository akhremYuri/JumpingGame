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

function movePlayer(step = 1) {
  clearPlayerPartOfCanvas(jumpLevel);
  jumpLevel += step;
  drawThePlayer(jumpLevel);
}

function keyDownEvent(event) {
  if (event.code == "Space") {
    while (jumpLevel > cJumpLevelOnY) {
      movePlayer(-cPlayerStep);
    }
  }
}

let keyDownTimerId;

function keyUpEvent(event) {
  if (event.code == "Space") {
    keyDownTimerId = setTimeout(function down() {
      movePlayer(cPlayerStep);
      if (jumpLevel < cLandLevelOnY) {
        keyDownTimerId = setTimeout(down, 10);
      } else clearTimeout(keyDownTimerId);
    }, 10);
  }
}

document.addEventListener("keydown", keyDownEvent);
document.addEventListener("keyup", keyUpEvent);

const cRoadY = 140;
const cTree0 = 220; //px;
let animateX = 0;

function drawRoad() {
  ctx.beginPath();
  ctx.moveTo(0, cRoadY);
  ctx.lineTo(cWidthOfCanvas, cRoadY);
  ctx.stroke();
}

const cRadiusT = 15;

function drawTrees(x0 = cTree0) {
  function drawTree(x, y, radius = cRadiusT) {
    ctx.beginPath();
    ctx.moveTo(x, y); //220, 140
    ctx.lineTo(x, y - 30);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y - 30, radius, (Math.PI / 180) * 135, (Math.PI / 180) * 45);
    ctx.fill();
  }

  drawTree(x0, cRoadY);
  drawTree(x0 + cRadiusT * 2, cRoadY);

  drawTree(x0 + 200, cRoadY);
}

function clearTrees(x0 = cTree0) {
  function clearTree(x, y, radius) {
    ctx.clearRect(x - radius, y - 45, radius * 2, 30 + radius);
  }

  let y = cRoadY - 1;

  clearTree(x0, y, cRadiusT);
  clearTree(x0 + cRadiusT * 2, y, cRadiusT);

  clearTree(x0 + 200, y, cRadiusT);
}

function animateTrees() {
  // if (animateX < -200) animateX = 0;
  clearTrees(animateX + cTree0);
  animateX -= 30; // animateX--;
  drawTrees(animateX + cTree0);
}

function draw() {
  drawRoad();
  drawTrees();
  drawThePlayer();
}

draw();

function writeTextToCanvas(text) {
  ctx.font = "48px serif";
  ctx.fillText(text, 100, 50);
}
writeTextToCanvas("Game over.");

//This functions is used in animation
let timerId;

function startInterval() {
  // timerId = setInterval(animateTrees, 10);
  timerId = setTimeout(animateTrees, 1000);
}

function stopInterval() {
  clearInterval(timerId);
  console.log("Interval stopped.");
}

window.main = () => {
  window.requestAnimationFrame(main);
  animateTrees();
  console.log(`animateX: ${animateX}`);
};
// main();
