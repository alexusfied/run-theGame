import { Ball } from "./balls.js";
import { StoppWatch } from "./stoppwatch.js";
import { Highscores } from "./highscores.js";

// Necessary variables are defined
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const btnNewGame = document.querySelector(".btn-newGame");
const mainContainer = document.querySelector(".mainContainer");
const gameOverInfo = document.querySelector(".game-over-info");
const timer = document.querySelector(".stopp-watch");
const highscoreList = document.querySelector(".highscores-list");

let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

// Here, the objects from the Ball class are initialized
const greenBall = new Ball(100, 100, "#0f9123", 20, 3, 6);
const blueBall = new Ball(400, 500, "#181c5e", 30, 2, -2);
const purpleBall = new Ball(300, 125, "#4c1d3f", 40, 8, -3);

// An instance of the StoppWatch class is created and the value of the time element set
const stoppWatch = new StoppWatch(timer, 0, 0, 1);

// An instance of the Highscores class is created
const highscores = new Highscores(highscoreList);

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

  setCurrentPosition: function (posX, posY) {
    this.posX = posX;
    this.posY = posY;
  },

  // The collision detection checks whether the player is touching any of the moving balls and stops the game if this should be the case
  collisionDetection: function (requestID) {
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
      cancelAnimationFrame(requestID);
      btnNewGame.style.opacity = "1";
      greenBall.setCurrentPosition(100, 100);
      blueBall.setCurrentPosition(400, 500);
      purpleBall.setCurrentPosition(300, 125);
      player.setCurrentPosition(canvas.width / 2, canvas.height / 2);
      gameOverInfo.style.visibility = "visible";
      clearInterval(stoppWatch.getIntervalID());
      highscores.checkScore(stoppWatch.getTime());
      highscores.writeList();
      stoppWatch.setTime(0, 0, 0);
      timer.textContent = "00:00:00";
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
  gameOverInfo.style.visibility = "hidden";
  btnNewGame.style.opacity = "0";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  greenBall.move();
  blueBall.move();
  purpleBall.move();
  player.play();
  const requestID = requestAnimationFrame(drawMain);
  player.collisionDetection(requestID);
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

// The main function is called and the game started, when the New Game-Button is clicked
btnNewGame.addEventListener("click", () => {
  stoppWatch.start();
  drawMain();
});
