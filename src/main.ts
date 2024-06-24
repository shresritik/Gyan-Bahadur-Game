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
  levelGrade,
  menuOptions,
  isCustom,
  gameState,
  GameState,
  audioLevel,
} from "./constants/constants";
import { Player } from "./classes/Player";
import { TileMap } from "./classes/TileMap";
import "./style.css";
import { Quiz } from "./classes/Quiz";
import { handleFullScreen } from "./utils/utils";
import singleWater from "./assets/single-water.png";
import {
  drawAboutScreen,
  drawPauseScreen,
  drawStartScreen,
  gameOverFunction,
} from "./components/menuScreens";
import { bgmAudio, loseAudio } from "./components/audio";
import { muteOption } from "./components/mute";

let tileMap: TileMap;
let player: Player;

let lastFrameTime = performance.now();

const keysArray: TKeys = {};
const image = new Image();
image.src = singleWater;
let maxScore: number = 0;

const setupEventListeners = () => {
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    keys[e.key] = true;
    keysArray[e.key] = true;
    if (
      e.code === "Space" &&
      levelGrade.level != 2 &&
      menuOptions.option != "Play"
    ) {
      if (
        gameState.currentState === GameState.Start ||
        gameState.currentState === GameState.GameOver
      ) {
        if (levelGrade.success == "success") {
          startGame(1);
        }
      }
    }

    if (e.code === "KeyM") {
      muteOption();
    }

    if (e.code === "KeyP" && gameState.currentState === GameState.Playing) {
      gameStatus.isPaused = !gameStatus.isPaused;
      if (!gameStatus.isPaused) {
        lastFrameTime = performance.now();
        requestAnimationFrame(gameLoop);
      } else {
        drawPauseScreen();
      }
    }
    if (e.key === "f" && player) {
      player.fireBullet(Math.PI);
    } else if (keys["g"]) {
      const angle = Math.PI / 6; // Fire at 30 degrees or -45 degrees based on direction
      player.fireBullet(angle);
    }
  });

  window.addEventListener("keyup", (e: KeyboardEvent) => {
    keys[e.key] = false;
    delete keysArray[e.key];
  });
};

const drawObjects = (level: number) => {
  tileMap = new TileMap(level);
  player = new Player({ x: 20, y: 100 }, 120, 60);
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

const writeLevel = () => {
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText(
    `Level: ${levelGrade.success == "success" ? "2" : "1"}`,
    170,
    35
  );
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

  switch (gameState.currentState) {
    case GameState.Start:
      if (menuOptions.option == "Start" || menuOptions.option == "Play") {
        startGame();
      } else if (menuOptions.option == "About") {
        drawAboutScreen();
      } else {
        drawStartScreen();
      }
      break;

    case GameState.Playing:
      if (gameStatus.gameOver) {
        gameState.currentState = GameState.GameOver;
        gameOverFunction();
        break;
      }

      tileMap?.moveX(player, deltaTime);
      tileMap?.drawEnemy(player, deltaTime);
      tileMap?.drawFruit(player, deltaTime);
      tileMap?.drawFlag(player, deltaTime);
      tileMap?.drawAnimal(player, deltaTime);
      tileMap?.drawAmmo(player, deltaTime);
      tileMap?.drawJet(player, deltaTime);
      player?.updateBullet(deltaTime);
      player?.draw(deltaTime);
      player?.moveY(deltaTime);
      player?.moveX(deltaTime);
      if (player.position.y >= CANVAS_HEIGHT) {
        loseAudio.play();
        gameStatus.gameOver = true;
      }

      objects.enemy.forEach((enemy) => {
        enemy.updateEnemyBullet(player, deltaTime);
        enemy.enemyBulletCollision();
        objects.platform.forEach((platform) => {
          enemy.platformCollision(platform);
        });
      });

      if (gameStatus.isQuiz && quizMap.quizMap != null) {
        quizMap.quizMap.draw();
      }

      writeBullet();
      writeScore();
      writeLevel();
      drawHealthBar();
      break;
    case GameState.GameOver:
      gameOverFunction();
      break;
  }
};

export const startGame = (value?: number) => {
  gameStatus.gameOver = false;
  gameStatus.isPaused = false;
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
  objects.jet.length = 0;
  audioLevel.isMuted = false;
  ammoObj.ammo = 5;
  levelGrade.level = 0;
  bgmAudio.pause();

  if (menuOptions.option == "Start") {
    drawObjects(1);
    // menuOptions.option = "";
  }
  if (levelGrade.success == "success" && value == 1) {
    drawObjects(2);
    // levelGrade.success = "fail";
  }
  if (
    isCustom.custom == true &&
    (menuOptions.option == "Editor" || menuOptions.option == "Play")
  ) {
    drawObjects(-1);

    // menuOptions.option = "";
  }

  if (player) {
    player.directionRight = true;
    bgmAudio.autoplay = true;
    bgmAudio.play();
    bgmAudio.volume = 0.8;
    player.velocityY = 0;
    player.gravity = 0.2;
  }

  gameState.currentState = GameState.Playing;
  lastFrameTime = performance.now();
};

setupEventListeners();
handleFullScreen();
requestAnimationFrame(gameLoop);
