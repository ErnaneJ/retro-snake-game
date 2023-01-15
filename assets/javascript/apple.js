class Apple{
  constructor(snake, color){
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

      this.color = color;
      this.size = snake.size - 5;

      if(!isTouching)  break;
    }
  }
}
