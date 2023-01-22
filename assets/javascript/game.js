class Game{
  PRIMARY_COLOR_FAMILIES = ["#B4ECED", "#81DDDF", "#46C5CA", "#2AA8B0"];
  COLORS = { 
    snake_body: () => this.PRIMARY_COLOR_FAMILIES[Math.floor(Math.random()*this.PRIMARY_COLOR_FAMILIES.length)], 
    snake_head: "#265B64", apple: '#f4c0c0', background: '#333333' 
  };
  
  constructor(canvas){
    this.fps = 10;
    this.canvas = canvas;
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
    this.context.createRect(this.apple.x, this.apple.y, this.apple.size, this.apple.size, this.apple.color);
  }

  updateBoard(){
    this.context.clearRect(0, 0, canvas.width, canvas.height);

    this.ai.play();
    this.snake.move(this.fps);
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
}