class Game{
  constructor(canvas){
    this.fps = 10;
    this.colors = { snake: '#C0F0F4', apple: '#f4c0c0', background: '#333333' }
    this.canvas = canvas;
    this.diesWhenHittingTheWall = true;
    this.diesByHittingHisOwnBody = true;
    this.context = this.canvas.getContext('2d');
    this.snake = new Snake(200, 200, 20);
    this.apple = new Apple(this.snake, this.colors.apple);
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
    this.context.createRect(0, 0, canvas.width, canvas.height, this.colors.background);
  
    for(var i = 0; i < this.snake.tail.length; i++){
      if(i === this.snake.tail.length -1){
        this.snake.tail[i].color = 'red'
        this.context.createRect(this.snake.tail[i].x + 2.5, this.snake.tail[i].y + 2.5, this.snake.size - 5, this.snake.size - 5, 'red');
      }else{
        this.snake.tail[i].color = this.colors.snake
        this.context.createRect(this.snake.tail[i].x + 2.5, this.snake.tail[i].y + 2.5, this.snake.size - 5, this.snake.size - 5, this.colors.snake);
      }
    }
  
    this.updateInformationsDom();
    this.context.createRect(this.apple.x, this.apple.y, this.apple.size, this.apple.size, this.apple.color);
  }

  async updateBoard(){
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
      this.snake.tail[this.snake.tail.length] = {x: this.apple.x, y: this.apple.y};
      delete this.apple;
      this.apple = new Apple(this.snake, this.colors.apple);
      
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
      console.log('He died! It hit the wall. :(');
      this.snakeDies();
    }
  }
  
  checkHitBody(){
    if(!this.diesByHittingHisOwnBody) return;

    let headTail = this.snake.tail[this.snake.tail.length - 1];
    let parts = this.snake.tail.filter(body => body.x === headTail.x && body.y === headTail.y)
  
    if(parts.length === 2) {
      console.log('He died! He hit his own body. :(');
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