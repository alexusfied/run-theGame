// Necessary variables are defined
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

// The Ball class is declared, which will serve as the blueprint for all the balls that appear in the game
class Ball {
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

// Here, the objects from the Ball class are initialized
const greenBall = new Ball(100, 100, "#0f9123", 20, 3, 6);
const blueBall = new Ball(400, 500, "#181c5e", 30, 2, -2);
const purpleBall = new Ball(300, 125, "#4c1d3f", 40, 8, -3);

// The player object represents the avatar of the player
const player = {
  posX: canvas.width / 2,
  posY: canvas.height / 2,
  speed: 6,
  pHeight: 25,
  pWidth: 25,
  // The draw player method draws the avatar of the player, in this case a black rectangle
  drawPlayer: function () {
    ctx.beginPath();
    ctx.rect(this.posX, this.posY, this.pHeight, this.pWidth);
    ctx.fillStyle = "#020100";
    ctx.fill();
    ctx.closePath();
  },
  currentPosition: function () {
    return [this.posX, this.posY];
  },

  // The collision detection checks whether the player is touching any of the moving balls and stops the game if this should be the case
  collisionDetection: function () {
    // Grab the current position of the player. This is an array with the x position at index 0 and y position at index 1
    const playerUpperLeftVertex = player.currentPosition();
    // Grab all four vertices of the players avatar and store them as objects in an array
    let verticesPlayerAv = [
      // Upper left vertex
      {
        x: playerUpperLeftVertex[0],
        y: playerUpperLeftVertex[1],
      },
      // Upper right vertex
      {
        x: playerUpperLeftVertex[0] + player.pWidth,
        y: playerUpperLeftVertex[1],
      },
      // Lower right vertex
      {
        x: playerUpperLeftVertex[0] + player.pWidth,
        y: playerUpperLeftVertex[1] + player.pHeight,
      },
      // Lower left vertex
      {
        x: playerUpperLeftVertex[0],
        y: playerUpperLeftVertex[1] + player.pHeight,
      },
    ];

    // Grab the moving balls and store them in an array
    const movBalls = [greenBall, purpleBall, blueBall];

    // Helper function to grab the ball which is closest to the players avatar
    function getClosestBall() {
      let closestBall = null;
      let ballMinDistance = 5000;
      let vertMinDistance = 5000;
      let closestVert = null;
      for (let i = 0; i < movBalls.length; i++) {
        // Check for the vert closest to the current ball
        for (let j = 0; j < verticesPlayerAv.length; j++) {
          let distance = Math.sqrt(
            Math.pow(Math.abs(movBalls[i].posY - verticesPlayerAv[j].y), 2) +
              Math.pow(Math.abs(movBalls[i].posX - verticesPlayerAv[j].x), 2)
          );

          if (distance < vertMinDistance) {
            vertMinDistance = distance;
            closestVert = verticesPlayerAv[j];
          }
        }
        // Calculate the distance of the closest vert to the current ball
        let distanceClosestVert = Math.sqrt(
          Math.pow(Math.abs(movBalls[i].posY - closestVert.y), 2) +
            Math.pow(Math.abs(movBalls[i].posX - closestVert.x), 2)
        );
        // If the distance to the current ball is shorter than the present shortest distance of a ball to the player, reassign the values
        if (distanceClosestVert < ballMinDistance) {
          ballMinDistance = distanceClosestVert;
          closestBall = [movBalls[i], distanceClosestVert];
        }
      }
      return closestBall;
    }

    // Store the closest ball in a variable
    const closestBall = getClosestBall();

    /* Check the distance of the closest ball. If the distance of this ball is shorter than its radius, 
    the ball is touching the players avatar and the game is over*/
    if (closestBall[1] < closestBall[0].radius) {
      alert("GAME OVER!");
      document.location.reload();
    }
  },
  // The play method lets the player move his avatar with the arrow keys within the boundaries of the canvas
  play: function () {
    this.drawPlayer();
    if (upPressed && this.posY - this.speed > 0) {
      this.posY -= this.speed;
    } else if (
      downPressed &&
      this.posY + this.speed < canvas.height - this.pHeight
    ) {
      this.posY += this.speed;
    } else if (leftPressed && this.posX - this.speed > 0) {
      this.posX -= this.speed;
    } else if (
      rightPressed &&
      this.posX + this.speed < canvas.width - this.pWidth
    ) {
      this.posX += this.speed;
    }
  },
};

// This is the main method, which calls all the other methods necessary for playing the game
function drawMain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  greenBall.move();
  blueBall.move();
  purpleBall.move();
  player.play();
  player.collisionDetection();
  requestAnimationFrame(drawMain);
}

// Event listeners are added, together with the corresponding functions below, so key events (only arrow keys in this case) are caught
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key === "Up" || e.key === "ArrowUp") {
    upPressed = true;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    downPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  } else if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Up" || e.key === "ArrowUp") {
    upPressed = false;
  } else if (e.key === "Down" || e.key === "ArrowDown") {
    downPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  } else if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  }
}

// The main function is called
drawMain();
