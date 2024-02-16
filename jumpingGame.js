const canvas = document.getElementById("gameCanvas");
const cWidthOfCanvas = 600; //px
const cHeightOfCanvas = 150; //px

if (!canvas.getContext) {
  alert("Your browser don't support the canvas element.");
}
const ctx = canvas.getContext("2d");

const cZeroLevelOnY_axis = 88; //px
function drawThePlayer(y = cZeroLevelOnY_axis) {
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

const cRoadY = 140;
const cBampY0 = 220; //px;
let animateY = 0;

function drawRoad() {
  ctx.beginPath();
  ctx.moveTo(0, cRoadY);
  ctx.lineTo(cWidthOfCanvas, cRoadY);
  ctx.stroke();
}

function drawBamps(y0 = cBampY0) {
  function drawBamp(x, y, radius = 10) {
    ctx.beginPath();
    ctx.moveTo(x, y); //220, 140
    ctx.arc(x + radius, y, radius, Math.PI, 0);
    ctx.fill();
  }

  drawBamp(y0, cRoadY);
  drawBamp(y0 + 200, cRoadY);
}

function draw() {
  drawRoad();

  drawBamps();

  drawThePlayer();
}

draw();

// const cXPlayer = 70;

function ClearPartOfCanvas(x = 0) {
  ctx.clearRect(x, cRoadY - 15, cWidthOfCanvas, 14);
}

function animateBamps() {
  if (animateY < -200) animateY = 0;
  ClearPartOfCanvas();
  drawBamps(animateY + cBampY0);
  // drawRoad();
  animateY--;
}

let timerId;

function startInterval() {
  timerId = setInterval(animateBamps, 10);
}

function stopInterval() {
  clearInterval(timerId);
  console.log("Interval stopped.");
}

function writeTextToCanvas(text) {
  ctx.font = "48px serif";
  ctx.fillText(text, 100, 50);
}

writeTextToCanvas("Game over, loser.");

//This function is used in animation
window.main = () => {
  window.requestAnimationFrame(main);
  animateBamps();
  console.log(`animateY: ${animateY}`);
};

// main();
