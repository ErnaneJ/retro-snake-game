class ArtificialIntelligence{
  constructor(game){
    this.active = false;
    this.game = game;
    this.lastPath = null;
  }

  play(){
    if(!this.active) return;

    this.decidePath(null);
  }

  decidePath(priority = false){
    let possiblePaths = ['RIGHT', 'LEFT', 'UP', 'DOWN'];

    if(this.lastPath === 'UP' || this.lastPath === 'DOWN') possiblePaths = ['RIGHT', 'LEFT', this.lastPath];
    if(this.lastPath === 'LEFT' || this.lastPath === 'RIGHT') possiblePaths = ['UP', 'DOWN', this.lastPath];

    if(possiblePaths.includes('RIGHT') && ((priority === 'RIGHT') || (this.bestDirection('RIGHT') && this.willNotHitTheBody('RIGHT')))){
      this.lastPath = 'RIGHT';
      this.game.snake.rotateX = 1;
      this.game.snake.rotateY = 0;
    }else if(possiblePaths.includes('DOWN') && ((priority === 'DOWN') || (this.bestDirection('DOWN') && this.willNotHitTheBody('DOWN')))){
      this.lastPath = 'DOWN';
      this.game.snake.rotateX = 0;
      this.game.snake.rotateY = 1;
    }else if(possiblePaths.includes('UP') && ((priority === 'UP') || (this.bestDirection('UP') && this.willNotHitTheBody('UP')))){
      this.lastPath = 'UP';
      this.game.snake.rotateX = 0;
      this.game.snake.rotateY = -1;
    }else if(possiblePaths.includes('LEFT') && ((priority === 'LEFT') || (this.bestDirection('LEFT') && this.willNotHitTheBody('LEFT')))){
      this.lastPath = 'LEFT';
      this.game.snake.rotateX = -1;
      this.game.snake.rotateY = 0;
    }else{
      const path = possiblePaths[Math.floor(Math.random()*possiblePaths.length)];
      this.decidePath(path);
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

    let parts = tail.filter(body => (Math.abs(body.x - x) <= 0.75) && (Math.abs(body.y - y) <= 0.75))


    return parts.length === 0;
  }
}