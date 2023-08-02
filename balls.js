// Grab necessary elements
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// The Ball class is declared, which will serve as the blueprint for all the balls that appear in the game
export class Ball {
  constructor(posX, posY, color, radius, moveX, moveY) {
    this.posX = posX;
    this.posY = posY;
    this.color = color;
    this.radius = radius;
    this.moveX = moveX;
    this.moveY = moveY;
  }
  // The drawBall method draws the ball itself on the canvas using the ball properties defined in the constructor method
  drawBall() {
    ctx.beginPath();
    ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    this.posX += this.moveX;
    this.posY += this.moveY;
  }
  // The currentPosition method returns the current position of the ball by providing the x and y coordinates
  currentPosition() {
    return [this.posX, this.posY];
  }
  setCurrentPosition(posX, posY) {
    this.posX = posX;
    this.posY = posY;
  }
  // The move method calls drawBall() to draw the ball on the canvas and lets the ball move inside of the boundaries of the canvas
  move() {
    this.drawBall();
    if (
      this.posX + this.moveX > canvas.width - this.radius ||
      this.posX + this.moveX < this.radius
    ) {
      this.moveX = -this.moveX;
    }

    if (
      this.posY + this.moveY > canvas.height - this.radius ||
      this.posY + this.moveY < this.radius
    ) {
      this.moveY = -this.moveY;
    }
  }
}
