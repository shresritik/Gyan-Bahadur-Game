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

const keysArray: TKeys = {};
const image = new Image();
image.src = singleWater;
let maxScore: number = 0;

const setupEventListeners = () => {
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    keys[e.key] = true;
    keysArray[e.key] = true;

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
        lastFrameTime = performance.now();
        requestAnimationFrame(gameLoop);
      } else {
        drawPauseScreen();
      }
    }
    if (e.key === "f" && player) {
      player.fireBullet();
    }
  });

  window.addEventListener("keyup", (e: KeyboardEvent) => {
    keys[e.key] = false;
    delete keysArray[e.key];
  });
};

const drawObjects = () => {
  tileMap = new TileMap();
  player = new Player({ x: 20, y: 50 }, 50, 50);
  tileMap.drawMap(player);
  quizMap.quizMap = new Quiz();
};

const writeScore = () => {
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  if (maxScore < scoreCount.score) {
    maxScore = scoreCount.score;
    localStorage.setItem("maxScore", JSON.stringify(maxScore));
  }
  ctx.fillText(`Score: ${scoreCount.score}`, 15, 35);
};

const writeBullet = () => {
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.drawImage(image, 110, 10, 20, 30);
  ctx.fillText(`${ammoObj.ammo}`, 140, 35);
};

const drawHealthBar = (
  x = 15,
  y = 50,
  width = 200,
  height = 20,
  maxHealth: number = 100
) => {
  let currentHealth = scoreCount.health;
  if (currentHealth <= 0) {
    gameStatus.gameOver = true;
  }

  ctx.fillStyle = "#000";
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "white";
  ctx.fillText(` ${currentHealth}%`, 215, 68);

  const healthWidth = (currentHealth / maxHealth) * width;
  ctx.fillStyle = "green";
  ctx.fillRect(x, y, healthWidth, height);

  ctx.strokeStyle = "#fff";
  ctx.strokeRect(x, y, width, height);
};

const gameLoop = (currentTime: number) => {
  if (!gameStatus.isPaused) {
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    updateGameState(deltaTime);
  }

  requestAnimationFrame(gameLoop);
};

const updateGameState = (deltaTime: number) => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  switch (currentState) {
    case GameState.Start:
      drawStartScreen();
      break;
    case GameState.Playing:
      if (gameStatus.gameOver) {
        currentState = GameState.GameOver;
        gameOverFunction();
        break;
      }

      player.draw(deltaTime);
      player.moveY(deltaTime);
      player.moveX(deltaTime);
      player.updateCooldown(deltaTime);

      tileMap.moveX(player, deltaTime);
      tileMap.drawEnemy(player, deltaTime);
      tileMap.drawFruit(player, deltaTime);
      tileMap.drawFlag(player, deltaTime);
      tileMap.drawAnimal(player, deltaTime);
      tileMap.drawAmmo(player, deltaTime);
      player.updateBullet(deltaTime);

      if (player.position.y > CANVAS_HEIGHT) {
        gameStatus.gameOver = true;
      }

      objects.enemy.forEach((enemy) => {
        enemy.updateEnemyBullet(player, deltaTime);
        enemy.enemyBulletCollision();
      });

      if (gameStatus.isQuiz && quizMap.quizMap != null) {
        quizMap.quizMap.draw();
      }

      writeBullet();
      writeScore();
      drawHealthBar();
      break;
    case GameState.GameOver:
      gameOverFunction();
      break;
  }
};

const startGame = () => {
  gameStatus.gameOver = false;
  scoreCount.score = 0;
  scoreCount.health = 100;
  objects.ammo.length = 0;
  objects.animal.length = 0;
  objects.enemy.length = 0;
  objects.flag.length = 0;
  objects.fruit.length = 0;
  objects.platform.length = 0;
  objects.bullet.length = 0;
  objects.enemyBullet.length = 0;
  objects.enemyFireBullet.length = 0;
  ammoObj.ammo = 5;

  if (player) {
    player.velocityY = 0;
    player.gravity = 0.2;
    player.directionRight = true;
  }

  currentState = GameState.Playing;
  lastFrameTime = performance.now();
  drawObjects();
};

setupEventListeners();
handleFullScreen();
requestAnimationFrame(gameLoop);
