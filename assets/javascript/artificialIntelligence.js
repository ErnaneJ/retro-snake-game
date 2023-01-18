class ArtificialIntelligence{
  constructor(game){
    this.active = true;
    this.game = game;
  }

  play(){
    if(!this.active) return;

    if(this.bestDirection('RIGHT') && this.willNotHitTheBody('RIGHT')){
      this.game.snake.rotateX = 1;
      this.game.snake.rotateY = 0;
    }else if(this.bestDirection('DOWN') && this.willNotHitTheBody('DOWN')){
      this.game.snake.rotateX = 0;
      this.game.snake.rotateY = 1;
    }else if(this.bestDirection('UP') && this.willNotHitTheBody('UP')){
      this.game.snake.rotateX = 0;
      this.game.snake.rotateY = -1;
    }else if(this.bestDirection('LEFT') && this.willNotHitTheBody('LEFT')){
      this.game.snake.rotateX = -1;
      this.game.snake.rotateY = 0;
    }else{
      console.log("I DON'T KNOW WHERE TO GO")
    }
  }

  bestDirection(direction){
    const right = this.game.snake.currentPositionX + this.game.snake.size;
    const distanceGoingRight = Math.sqrt(Math.pow(right - this.game.apple.x, 2));
    
    const left = this.game.snake.currentPositionX - this.game.snake.size;
    const distanceGoingLeft = Math.sqrt(Math.pow(left - this.game.apple.x, 2));
    
    const up = this.game.snake.currentPositionY - this.game.snake.size;
    const distanceGoingUp = Math.sqrt(Math.pow(up - this.game.apple.y, 2));
    
    const down = this.game.snake.currentPositionY + this.game.snake.size;
    const distanceGoingDown = Math.sqrt(Math.pow(down - this.game.apple.y, 2));

    if(direction === 'RIGHT'){
      return distanceGoingRight < distanceGoingLeft && (right <= this.game.canvas.width || !this.game.diesWhenHittingTheWall);
    } else if(direction === 'DOWN'){
      return distanceGoingUp > distanceGoingDown && (down <= this.game.canvas.height || !this.game.diesWhenHittingTheWall);
    } else if(direction === 'UP'){
      return distanceGoingDown > distanceGoingUp && (up >= 0 || !this.game.diesWhenHittingTheWall);
    } else if(direction === 'LEFT'){
      return distanceGoingRight > distanceGoingLeft && (left >= 0 || !this.game.diesWhenHittingTheWall);
    } else{
      return false;
    }
  }

  willNotHitTheBody(direction){
    if(!this.game.diesByHittingHisOwnBody) return true;

    let tail = this.game.snake.tail;

    let {x, y} = JSON.parse(JSON.stringify({x: this.game.snake.currentPositionX, y: this.game.snake.currentPositionY}));

    if(direction === 'RIGHT'){
      x = x + this.game.snake.size;
    } else if(direction === 'DOWN'){
      y = y + this.game.snake.size;
    } else if(direction === 'UP'){
      y = y - this.game.snake.size;
    } else if(direction === 'LEFT'){
      x = x - this.game.snake.size;
    }

    let  parts = tail.filter(body => body.x === x && body.y === y)

    if(direction === 'RIGHT'){
      x = x + this.game.snake.size * 2;
    } else if(direction === 'DOWN'){
      y = y + this.game.snake.size * 2;
    } else if(direction === 'UP'){
      y = y - this.game.snake.size * 2;
    } else if(direction === 'LEFT'){
      x = x - this.game.snake.size * 2;
    }

    let parts2 = tail.filter(body => body.x === x && body.y === y)

    if(direction === 'RIGHT'){
      x = x + this.game.snake.size * 2;
    } else if(direction === 'DOWN'){
      y = y + this.game.snake.size * 2;
    } else if(direction === 'UP'){
      y = y - this.game.snake.size * 2;
    } else if(direction === 'LEFT'){
      x = x - this.game.snake.size * 2;
    }

    let parts3 = tail.filter(body => body.x === x && body.y === y)

    return parts.length === 0 && parts2.length === 0 && parts3.length === 0;
  }
}