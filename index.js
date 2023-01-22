const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext('2d');

CanvasRenderingContext2D.prototype.createRect = function (x, y, width, height, color) {
  this.fillStyle = color;
  this.beginPath();
  this.roundRect(x, y, width, height, 3, 3);
  this.fill();
}

function startGame(){
  window.snakeGame = new Game(canvas, canvasContext);
  loadEvents(window.snakeGame);
}

startGame();