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
} from "./constants/constants";
import { Player } from "./classes/Player";
import { TileMap } from "./classes/TileMap";
import "./style.css";
import { Quiz } from "./classes/Quiz";
import { handleFullScreen } from "./utils/utils";
import singleWater from "./assets/single-water.png";
let tileMap: TileMap;
let player: Player;
enum GameState {
  Start,
  Playing,
  GameOver,
}
let currentState: GameState = GameState.Start;
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

function writeScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText(`Score: ${scoreCount.score}`, 15, 35);
}
function writeBullet() {
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  const image = new Image();
  image.src = singleWater;
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

let lastFrameTime = performance.now();

function gameLoop(currentTime: number) {
  if (!gameStatus.isPaused) {
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    updateGameState(deltaTime);
  }

  requestAnimationFrame(gameLoop);
}
export function drawStartScreen() {
  ctx.fillStyle = "#F7F0EA";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "red";
  ctx.font = "40px sans-serif";
  ctx.fillText("Doodle Jump", CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2 - 80);
  ctx.font = "30px sans-serif";
  ctx.fillText("Press Space to Start", CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2);
  ctx.font = "22px sans-serif";
  ctx.fillText(
    "Move Left: a key. Move Right:d key",
    CANVAS_WIDTH / 5,
    CANVAS_HEIGHT / 2 + 40
  );
  ctx.fillText("Bullet: f key ", CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2 + 70);
  ctx.font = "22px sans-serif";
  ctx.fillText(
    "Pause/Resume: p key",
    CANVAS_WIDTH / 5,
    CANVAS_HEIGHT / 2 + 100
  );
}
export function gameOverFunction() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "red";
  ctx.font = "40px sans-serif";
  ctx.fillText("Game Over", CANVAS_WIDTH / 4 + 20, CANVAS_HEIGHT / 2 - 50);
  let maxScore = localStorage.getItem("maxScore");
  ctx.font = "30px sans-serif";
  ctx.fillText(
    `High Score: ${maxScore}`,
    CANVAS_WIDTH / 4 + 30,
    CANVAS_HEIGHT / 2
  );
  ctx.fillText(
    `Your Score: ${scoreCount.score}`,
    CANVAS_WIDTH / 4 + 30,
    CANVAS_HEIGHT / 2 + 40
  );

  ctx.fillText(
    `Press Space to restart`,
    CANVAS_WIDTH / 4 - 20,
    CANVAS_HEIGHT / 2 + 100
  );
}
//check the game stats for same fps in all the devices
// functions for start,pause and game over screens
// main game function calls
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

    player.draw();
    player.moveY();
    player.moveX(deltaTime);

    tileMap.moveX(player, deltaTime);
    tileMap.drawEnemy(player, deltaTime);
    tileMap.drawFruit(player, deltaTime);
    tileMap.drawFlag(player, deltaTime);
    tileMap.drawAnimal(player, deltaTime);
    tileMap.drawAmmo(player, deltaTime);
    player.updateBullet();

    objects.enemy.forEach((enemy) => {
      enemy.updateEnemyBullet(player);
      enemy.enemyBulletCollision(player);
    });
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
// Start the game loop initially

handleFullScreen();

function startGame() {
  gameStatus.gameOver = false;
  scoreCount.score = 0;
  if (player) {
    player.velocityY = 0;
    player.gravity = 0.2;
    player.bulletArray = [];
    player.directionRight = true;
    player.playerSpeed = 2;
    // maxBullets = 5;
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
      lastFrameTime = performance.now(); // Reset time to avoid time jump
      requestAnimationFrame(gameLoop);
    } else {
      drawPauseScreen();
    }
  }
});
export function drawPauseScreen() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "red";
  ctx.font = "30px sans-serif";
  ctx.fillText("Game Paused", CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2);
  ctx.fillText("Press P to Resume", CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2 + 50);
}
requestAnimationFrame(gameLoop);
