const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext('2d');

const game = new Game(canvas, canvasContext);

CanvasRenderingContext2D.prototype.createRect = function (x, y, width, height, color) {
  this.fillStyle = color;
  this.fillRect(x, y, width, height);
}

document.getElementById('dark-theme').addEventListener('change', (e) => {
  if(e.target.checked){
    document.body.classList.add('dark');
  }else{
    document.body.classList.remove('dark'); 
  }
})

window.addEventListener('keydown', event => {
  setTimeout(() => {
    if (event.keyCode == 37 && game.snake.rotateX != 1) {
        game.snake.rotateX = -1;
        game.snake.rotateY = 0;
    } else if (event.keyCode == 38 && game.snake.rotateY != 1) {
        game.snake.rotateX = 0;
        game.snake.rotateY = -1;
    } else if (event.keyCode == 39 && game.snake.rotateX != -1) {
        game.snake.rotateX = 1;
        game.snake.rotateY = 0;
    } else if (event.keyCode == 40 && game.snake.rotateY != -1) {
        game.snake.rotateX = 0;
        game.snake.rotateY = 1;
    }
  }, 1)
});