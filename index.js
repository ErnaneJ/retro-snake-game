const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext('2d');
let fpsBase = 10;

const colors = {
  snake: '#C0F0F4',
  food: '#f4c0c0',
  background: '#333333'
}

class Snake{
  constructor(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
    this.tail = [{x:this.x, y:this.y}]
    this.rotateX = 0;
    this.rotateY = 1;
  }

  move(){
    let newRect;
    if(this.rotateX == 1){
      newRect = {
        x: this.tail[this.tail.length - 1].x + this.size,
        y: this.tail[this.tail.length - 1].y
      }
    }else if(this.rotateX == -1){
      newRect = {
        x: this.tail[this.tail.length - 1].x - this.size,
        y: this.tail[this.tail.length - 1].y
      }
    }else if(this.rotateY == 1){
      newRect = {
        x: this.tail[this.tail.length - 1].x,
        y: this.tail[this.tail.length - 1].y + this.size
      }
    }else if(this.rotateY == -1){
      newRect = {
        x: this.tail[this.tail.length - 1].x,
        y: this.tail[this.tail.length - 1].y - this.size
      }
    }

    this.tail.shift();
    this.tail.push(newRect);
  }
}

class Apple{
  constructor(){
    let isTouching;
    while(true){
      isTouching = false;
      this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size;
      this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size;

      for(var i = 0; i < snake.tail.length; i++){
        if(this.x == snake.tail[i].x && this.y == snake.tail[i].y){
          isTouching = true;
        }
      }

      this.color = colors.food;
      this.size = snake.size - 5;

      if(!isTouching)  break;
    }
  }
}

let snake = new Snake(0, 0, 20);
let apple = new Apple();

window.onload = () => {
  gameLoop();
}

function gameLoop(){
  clearInterval(window.gameInterval);
  window.gameInterval = setInterval(show, 1000/fpsBase) // here 15 is our fps value
}

function show(){
  update();
  draw();
}

function update(){
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  snake.move();
  checkHitWall();
  checkHitBody();
  eatApple();
}

function checkHitWall(){
  let headTail = snake.tail[snake.tail.length - 1];
  if(headTail.x <= - snake.size){
    headTail.x = canvas.width - snake.size;
  }else if(headTail.x >= canvas.width){
    headTail.x = 0;
  }else if(headTail.y <= - snake.size){
    headTail.y = canvas.height - snake.size;
  }else if(headTail.y >= canvas.height ){
    headTail.y = 0;
  }
}

function checkHitBody(){
  let headTail = snake.tail[snake.tail.length - 1];
  let elements = snake.tail.filter(body => body.x === headTail.x && body.y === headTail.y)

  if(elements.length === 2){
    delete snake;
    snake = new Snake(0, 0, 20);
  }
}

function eatApple(){
  if(snake.tail[snake.tail.length - 1].x == apple.x && snake.tail[snake.tail.length - 1].y == apple.y){
    snake.tail[snake.tail.length] = {x:apple.x, y:apple.y};
    delete apple;
    apple = new Apple();
    
    fpsBase += .5;
    gameLoop();
  }
}

function draw(){
  createRect(0, 0, canvas.width, canvas.height, colors.background);
  
  for(var i = 0; i < snake.tail.length; i++){
    createRect(snake.tail[i].x + 2.5, snake.tail[i].y + 2.5, snake.size - 5, snake.size - 5, colors.snake);
  }

  updateInformations();
  createRect(apple.x, apple.y, apple.size, apple.size, apple.color);
}

function updateInformations(){
  const currentScore = document.getElementById('current-score');
  currentScore.innerText = 'Score: ' + (snake.tail.length - 1);

  const speed = document.getElementById('speed');
  speed.innerText = 'Speed: ' + (fpsBase/10).toFixed(2) + 'x';

  const bestScore = document.getElementById('best-score');
  const localStorageBestScore = localStorage.getItem('best-score');
  console.log()
  if(parseInt(localStorageBestScore) >= (snake.tail.length - 1)){
    bestScore.innerText = 'Best: ' + localStorageBestScore;
  }else{
    bestScore.innerText = 'Best: ' + (snake.tail.length - 1);
    localStorage.setItem('best-score', (snake.tail.length - 1));
  }
}

function createRect(x, y, width, height, color){
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
}

window.addEventListener('keydown', event => {
  setTimeout(() => {
    if (event.keyCode == 37 && snake.rotateX != 1) {
        snake.rotateX = -1;
        snake.rotateY = 0;
    } else if (event.keyCode == 38 && snake.rotateY != 1) {
        snake.rotateX = 0;
        snake.rotateY = -1;
    } else if (event.keyCode == 39 && snake.rotateX != -1) {
        snake.rotateX = 1;
        snake.rotateY = 0;
    } else if (event.keyCode == 40 && snake.rotateY != -1) {
        snake.rotateX = 0;
        snake.rotateY = 1;
    }
  }, 1)
});