const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext('2d');

CanvasRenderingContext2D.prototype.createRect = function (x, y, width, height, color) {
  this.fillStyle = color;
  this.fillRect(x, y, width, height);
}

function startGame(){
  window.snakeGame = new Game(canvas, canvasContext);
  loadEvents(window.snakeGame);
}

startGame();