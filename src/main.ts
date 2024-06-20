import { ctx } from "./components/canvas";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  objects,
  scoreCount,
  keys,
  gameStatus,
  quizMap,
  ammoObj,
  TKeys,
} from "./constants/constants";
import { Player } from "./classes/Player";
import { TileMap } from "./classes/TileMap";
import "./style.css";
import { Quiz } from "./classes/Quiz";
import { handleFullScreen } from "./utils/utils";
import singleWater from "./assets/single-water.png";
import {
  drawPauseScreen,
  drawStartScreen,
  gameOverFunction,
} from "./components/menuScreens";

let tileMap: TileMap;
let player: Player;
enum GameState {
  Start,
  Playing,
  GameOver,
}
let currentState: GameState = GameState.Start;
let lastFrameTime = performance.now();

window.addEventListener("keydown", (e: KeyboardEvent) => {
  keys[e.key] = true;
});
window.addEventListener("keyup", (e: KeyboardEvent) => {
  keys[e.key] = false;
});

const drawObjects = () => {
  tileMap = new TileMap();
  player = new Player({ x: 20, y: 50 }, 50, 50);
  tileMap.drawMap(player);
  quizMap.quizMap = new Quiz();
  // player.createQuiz();
};
let maxScore: number = 0;
function writeScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  if (maxScore < scoreCount.score) {
    maxScore = scoreCount.score;
    localStorage.setItem("maxScore", JSON.stringify(maxScore));
  }
  ctx.fillText(`Score: ${scoreCount.score}`, 15, 35);
}
const image = new Image();
image.src = singleWater;
function writeBullet() {
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";

  ctx.drawImage(image, 110, 10, 20, 30);
  ctx.fillText(`${ammoObj.ammo}`, 140, 35);
}

// Function to draw the health bar
function drawHealthBar(
  x = 15,
  y = 50,
  width = 200,
  height = 20,
  maxHealth: number = 100
) {
  let currentHealth = scoreCount.health;
  if (scoreCount.health <= 0) {
    gameStatus.gameOver = true;
  }
  // Background
  ctx.fillStyle = "#000";
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "white";
  ctx.fillText(` ${scoreCount.health}%`, 215, 68);
  // Health bar
  const healthWidth = (currentHealth / maxHealth) * width;
  ctx.fillStyle = "green";
  ctx.fillRect(x, y, healthWidth, height);

  // Border
  ctx.strokeStyle = "#fff";
  ctx.strokeRect(x, y, width, height);
}

function gameLoop(currentTime: number) {
  if (!gameStatus.isPaused) {
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    updateGameState(deltaTime);
  }

  requestAnimationFrame(gameLoop);
}

//check the game stats for same fps in all the devices
// functions for start,pause and game over screens
// main game function calls
const keysArray: TKeys = {};
// Start the game loop initially
window.addEventListener("keydown", (e: KeyboardEvent) => {
  keysArray[e.key] = true;
});
window.addEventListener("keyup", (event) => {
  delete keysArray[event.key];
});
function updateGameState(deltaTime: number) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (currentState === GameState.Start) {
    drawStartScreen();
  } else if (currentState === GameState.Playing) {
    if (gameStatus.isPaused) {
      drawPauseScreen();
      return;
    }

    if (gameStatus.gameOver) {
      currentState = GameState.GameOver;
      gameOverFunction();
      return;
    }

    player.draw(deltaTime);
    player.moveY(deltaTime);
    player.moveX(deltaTime);

    tileMap.moveX(player, deltaTime);
    tileMap.drawEnemy(player, deltaTime);
    tileMap.drawFruit(player, deltaTime);
    tileMap.drawFlag(player, deltaTime);
    tileMap.drawAnimal(player, deltaTime);
    tileMap.drawAmmo(player, deltaTime);
    player.updateBullet(deltaTime);

    objects.enemy.forEach((enemy) => {
      enemy.updateEnemyBullet(player, deltaTime);
      enemy.enemyBulletCollision(player);
    });
    if (keysArray["f"]) {
      player.drawBullet(deltaTime);
    }

    if (gameStatus.isQuiz && quizMap.quizMap != null) {
      quizMap.quizMap.draw();
    }
    writeBullet();
    writeScore();
    drawHealthBar();
  } else if (currentState === GameState.GameOver) {
    gameOverFunction();
  }
}

function startGame() {
  gameStatus.gameOver = false;
  scoreCount.score = 0;
  scoreCount.health = 100;
  objects.ammo.length = 0;
  objects.animal.length = 0;
  objects.enemy.length = 0;
  objects.flag.length = 0;
  objects.fruit.length = 0;
  objects.platform.length = 0;
  ammoObj.ammo = 5;
  if (player) {
    player.velocityY = 0;
    player.gravity = 0.2;
    player.bulletArray = [];
    player.directionRight = true;
    player.playerSpeed = 2;
    player.cooldown = false;
  }
  currentState = GameState.Playing;
  lastFrameTime = performance.now();
  drawObjects();
}
window.addEventListener("keypress", (e: KeyboardEvent) => {
  if (e.code === "Space") {
    if (
      currentState === GameState.Start ||
      currentState === GameState.GameOver
    ) {
      startGame();
    }
  }
  if (e.code === "KeyP" && currentState === GameState.Playing) {
    gameStatus.isPaused = !gameStatus.isPaused;
    if (!gameStatus.isPaused) {
      // Adjust the lastFrameTime to exclude the paused duration
      lastFrameTime = performance.now();
      requestAnimationFrame(gameLoop);
    } else {
      drawPauseScreen();
    }
  }
});

handleFullScreen();

requestAnimationFrame(gameLoop);
