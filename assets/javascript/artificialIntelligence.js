class ArtificialIntelligence{
  constructor(game){
    this.active = false;
    this.game = game;
    this.map = [];
  }

  play(){
    this.updateMap();
    if(!this.active) return;
    
    this.decidePath(null);
  }

  updateMap(){
    const columns = this.game.canvas.width / this.game.snake.size;
    const rows = this.game.canvas.height / this.game.snake.size;

    const positionsSnake = this.game.snake.tail.map(tail => ({y: tail.x/this.game.snake.size, x: tail.y/this.game.snake.size}))

    this.map = new Array(rows).fill(0).map((el) => new Array(columns).fill(el));
    this.map = this.map.map((colElements, colIndex) => {
      return colElements.map((rowElements, rowIndex) => {
        let decider = positionsSnake.map((pos) => pos.x === colIndex && pos.y === rowIndex).includes(true);
        if(decider){
          return 1;
        }else{
          return 0;
        }
      });
    });
  }

  decidePath(){
    let fallback = true;
    if(this.bestDirection('RIGHT')){
      fallback = false;
      this.game.snake.rotateX = 1;
      this.game.snake.rotateY = 0;
    }
    
    if(this.bestDirection('DOWN')){
      fallback = false;
      this.game.snake.rotateX = 0;
      this.game.snake.rotateY = 1;
    }
    
    if(this.bestDirection('UP')){
      fallback = false;
      this.game.snake.rotateX = 0;
      this.game.snake.rotateY = -1;
    }
    
    if(this.bestDirection('LEFT')){
      fallback = false;
      this.game.snake.rotateX = -1;
      this.game.snake.rotateY = 0;
    }
    
    if(fallback){
      console.log('usando rota de seguranca')
      const positionMatrixRIGHT = {x: this.possiblePosition('RIGHT').x / this.game.snake.size, y: this.possiblePosition('RIGHT').y / this.game.snake.size}
      let bateRIGHT = this.map[positionMatrixRIGHT.y] ? this.map[positionMatrixRIGHT.y][positionMatrixRIGHT.x] === 1 : true;
      if(positionMatrixRIGHT.x < 0 || positionMatrixRIGHT.y < 0) bateRIGHT = true;
      
      const positionMatrixDOWN = {x: this.possiblePosition('DOWN').x / this.game.snake.size, y: this.possiblePosition('DOWN').y / this.game.snake.size}
      let bateDOWN = this.map[positionMatrixDOWN.y] ? this.map[positionMatrixDOWN.y][positionMatrixDOWN.x] === 1 : true;
      if(positionMatrixDOWN.x < 0 || positionMatrixDOWN.y < 0) bateDOWN = true;
      
      const positionMatrixUP = {x: this.possiblePosition('UP').x / this.game.snake.size, y: this.possiblePosition('UP').y / this.game.snake.size}
      let bateUP = this.map[positionMatrixUP.y] ? this.map[positionMatrixUP.y][positionMatrixUP.x] === 1 : true;
      if(positionMatrixUP.x < 0 || positionMatrixUP.y < 0) bateUP = true;

      const positionMatrixLEFT = {x: this.possiblePosition('LEFT').x / this.game.snake.size, y: this.possiblePosition('LEFT').y / this.game.snake.size}
      let bateLEFT = this.map[positionMatrixLEFT.y] ? this.map[positionMatrixLEFT.y][positionMatrixLEFT.x] === 1 : true;
      if(positionMatrixLEFT.x < 0 || positionMatrixLEFT.y < 0) bateLEFT = true;

      if(!bateRIGHT){
        this.lastPath = 'RIGHT';
        this.game.snake.rotateX = 1;
        this.game.snake.rotateY = 0;
      }else if(!bateDOWN){
        this.lastPath = 'DOWN';
        this.game.snake.rotateX = 0;
        this.game.snake.rotateY = 1;
      }else if(!bateUP){
        this.lastPath = 'UP';
        this.game.snake.rotateX = 0;
        this.game.snake.rotateY = -1;
      }else if(!bateLEFT){
        this.lastPath = 'LEFT';
        this.game.snake.rotateX = -1;
        this.game.snake.rotateY = 0;
      }
    }
  }

  possiblePosition(direction){
    if(direction === 'RIGHT'){
      return {
        x: this.game.snake.currentPositionX + this.game.snake.size, 
        y: this.game.snake.currentPositionY
      }
    } else if(direction === 'DOWN'){
      return  {
        x: this.game.snake.currentPositionX, 
        y: this.game.snake.currentPositionY + this.game.snake.size
      }
    } else if(direction === 'UP'){
      return  {
        x: this.game.snake.currentPositionX, 
        y: this.game.snake.currentPositionY - this.game.snake.size
      }
    } else if(direction === 'LEFT'){
      return  {
        x: this.game.snake.currentPositionX - this.game.snake.size, 
        y: this.game.snake.currentPositionY
      }
    }
  }

  bestDirection(direction){
    const right = this.possiblePosition('RIGHT').x;
    const distanceGoingRight = Math.sqrt(Math.pow(right - this.game.apple.x, 2));
    
    const left = this.possiblePosition('LEFT').x;
    const distanceGoingLeft = Math.sqrt(Math.pow(left - this.game.apple.x, 2));
    
    const up = this.possiblePosition('UP').y;
    const distanceGoingUp = Math.sqrt(Math.pow(up - this.game.apple.y, 2));
    
    const down = this.possiblePosition('DOWN').y;
    const distanceGoingDown = Math.sqrt(Math.pow(down - this.game.apple.y, 2));

    const positionMatrix = {x: this.possiblePosition(direction).x / this.game.snake.size, y: this.possiblePosition(direction).y / this.game.snake.size}
    let bate = this.map[positionMatrix.y] ? this.map[positionMatrix.y][positionMatrix.x] === 1 : true;
    if(positionMatrix.x < 0 || positionMatrix.y < 0) bate = true;

    if(direction === 'RIGHT'){
      return distanceGoingRight < distanceGoingLeft && !bate;
    } else if(direction === 'DOWN'){
      return distanceGoingUp > distanceGoingDown && !bate;
    } else if(direction === 'UP'){
      return distanceGoingDown > distanceGoingUp && !bate;
    } else if(direction === 'LEFT'){
      return distanceGoingRight > distanceGoingLeft && !bate;
    }
  }
}