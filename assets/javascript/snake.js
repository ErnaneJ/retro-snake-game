class Snake{
  constructor(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
    this.tail = [{x:this.x, y:this.y}]
    this.rotateX = 0;
    this.rotateY = 1;
    this.lastPath = null;

    this.currentPositionX = x;
    this.currentPositionY = y;
  }

  move(){
    let newRect;
    if(this.rotateX == 1){
      this.lastPath = 'RIGTH'
      newRect = {
        x: this.tail[this.tail.length - 1].x + this.size,
        y: this.tail[this.tail.length - 1].y
      }
    }else if(this.rotateX == -1){
      this.lastPath = 'LEFT'
      newRect = {
        x: this.tail[this.tail.length - 1].x - this.size,
        y: this.tail[this.tail.length - 1].y
      }
    }else if(this.rotateY == 1){
      this.lastPath = 'BOTTOM'
      newRect = {
        x: this.tail[this.tail.length - 1].x,
        y: this.tail[this.tail.length - 1].y + this.size
      }
    }else if(this.rotateY == -1){
      this.lastPath = 'TOP'
      newRect = {
        x: this.tail[this.tail.length - 1].x,
        y: this.tail[this.tail.length - 1].y - this.size
      }
    }

    this.tail.shift();
    this.tail.push(newRect);
    this.currentPositionX = newRect.x;
    this.currentPositionY = newRect.y;
  }
}