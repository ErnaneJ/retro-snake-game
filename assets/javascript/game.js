class Game{
  PRIMARY_COLOR_FAMILIES = ["#B4ECED", "#81DDDF", "#46C5CA", "#2AA8B0"];
  COLORS = { 
    snake_body: () => this.PRIMARY_COLOR_FAMILIES[Math.floor(Math.random()*this.PRIMARY_COLOR_FAMILIES.length)], 
    snake_head: "#265B64", apple: '#f4c0c0', background: '#333333' 
  };
  
  constructor(canvas){
    this.fps = 10;
    this.canvas = canvas;
    this.showBoardGrid = false;
    this.diesWhenHittingTheWall = true;
    this.diesByHittingHisOwnBody = true;
    this.context = this.canvas.getContext('2d');
    this.snake = new Snake(200, 200, 20);
    this.apple = new Apple(this.snake, this.COLORS.apple);
    this.ai = new ArtificialIntelligence(this);

    this.loop();
  }

  loop(){
    clearInterval(window.gameInterval);
    
    window.gameInterval = setInterval(() => {
      this.updateBoard();
      this.drawBoard();
    }, 1000/this.fps);
  }

  drawBoard(){
    this.context.createRect(0, 0, canvas.width, canvas.height, this.COLORS.background);

    if(this.showBoardGrid){
      for (let x = 0; x <= this.canvas.width; x += this.snake.size) {
        this.context.moveTo(x + this.snake.size, -this.snake.size);
        this.context.lineTo(x + this.snake.size, this.canvas.height + this.snake.size);
      }
  
      for (let x = 0; x <= this.canvas.height; x += this.snake.size) {
        this.context.moveTo(-this.snake.size, x + this.snake.size);
        this.context.lineTo(this.canvas.width + this.snake.size, x + this.snake.size);
      }
      this.context.stroke();
    }

    for(var i = 0; i < this.snake.tail.length; i++){
      if(i === this.snake.tail.length -1){
        this.snake.tail[i].color = this.COLORS.snake_head;
        this.context.createRect(this.snake.tail[i].x + 2.5, this.snake.tail[i].y + 2.5, this.snake.size - 5, this.snake.size - 5, this.COLORS.snake_head);
      }else{
        this.snake.tail[i].color = this.COLORS.snake
        this.context.createRect(this.snake.tail[i].x + 2.5, this.snake.tail[i].y + 2.5, this.snake.size - 5, this.snake.size - 5, this.COLORS.snake_body());
      }
    }

    this.updateInformationsDom();
    this.context.createRect(this.apple.x + 2.5, this.apple.y + 2.5, this.apple.size, this.apple.size, this.apple.color);
  }

  updateBoard(){
    this.context.clearRect(0, 0, canvas.width, canvas.height);

    this.ai.play();
    this.snake.move(this.fps);
    this.updateBoardStatus();
    this.checkHitWall();
    this.checkHitBody();
    this.eatApple();
  }

  updateInformationsDom(){
    const currentScore = document.getElementById('current-score');
    currentScore.innerText = 'Score: ' + (this.snake.tail.length - 1);
  
    const speed = document.getElementById('speed');
    speed.innerText = 'Speed: ' + (this.fps/10).toFixed(2) + 'x';
  
    const bestScore = document.getElementById('best-score');
    const localStorageBestScore = localStorage.getItem('best-score');
  
    if(parseInt(localStorageBestScore) >= (this.snake.tail.length - 1)){
      bestScore.innerText = 'Best: ' + localStorageBestScore;
    }else{
      bestScore.innerText = 'Best: ' + (this.snake.tail.length - 1);
      localStorage.setItem('best-score', (this.snake.tail.length - 1));
    }
  }

  eatApple(){
    if(this.snake.tail[this.snake.tail.length - 1].x == this.apple.x && this.snake.tail[this.snake.tail.length - 1].y == this.apple.y){
      this.snake.tail[this.snake.tail.length] = {x: this.apple.x, y: this.apple.y, new: true};
      delete this.apple;
      this.apple = new Apple(this.snake, this.COLORS.apple);
      
      this.fps += .5;
      this.loop();
    }
  }

  checkHitWall(){
    let hit = false;
    let headTail = this.snake.tail[this.snake.tail.length - 1];
    if(headTail.x <= - this.snake.size){
      headTail.x = this.canvas.width - this.snake.size;
      hit = true;
    }else if(headTail.x >= this.canvas.width){
      headTail.x = 0;
      hit = true;
    }else if(headTail.y <= - this.snake.size){
      headTail.y = this.canvas.height - this.snake.size;
      hit = true;
    }else if(headTail.y >= this.canvas.height ){
      headTail.y = 0;
      hit = true;
    }

    if(hit && this.diesWhenHittingTheWall){
      this.snakeDies();
    }
  }
  
  checkHitBody(){
    if(!this.diesByHittingHisOwnBody) return;

    let headTail = this.snake.tail[this.snake.tail.length - 1];
    let parts = this.snake.tail.filter(body => body.x === headTail.x && body.y === headTail.y)
  
    if(parts.length === 2 && !parts[1]?.new) {
      this.snakeDies();
    }
  }

  snakeDies(){
    delete this.snake;
    this.snake = new Snake(200, 200, 20);
    this.fps = 10;
    this.loop();
  }

  updateBoardStatus(){
    const boardDiv = document.getElementById("board-status");
    const lastMove = document.getElementById("last-move");
    const applePosition = document.getElementById("apple-position");
    const snakeHeadPosition = document.getElementById("snake-head-position");

    const positionAppleMatrix = {y: this.apple.x / this.snake.size, x: this.apple.y / this.snake.size}
    const board = this.ai.map;

    board[positionAppleMatrix.x][positionAppleMatrix.y] = "🍎"
    boardDiv.innerHTML = this.ai.map.map(m => {
      m = m.map((el) => `
        <span style="width: 20px; font-size: 15px; height: 20px; display: inline-flex; align-items: center; justify-content: center;">
          ${el === 1 ? '🟦' : el }
        </span>
      `);
      return `<div style="margin: 0; padding:0;">${m.join(' ')}<div>`
    }).join('');

    applePosition.innerHTML = `Apple Position:  {x: ${this.apple.y}, y: ${this.apple.x}}`
    lastMove.innerHTML = `Last Move: ${this.snake.lastPath}`;
    snakeHeadPosition.innerHTML = `Snake Head Position: {x: ${this.snake.currentPositionX}, y: ${this.snake.currentPositionY}}`

    // clearInterval(window.gameInterval);
  }
}