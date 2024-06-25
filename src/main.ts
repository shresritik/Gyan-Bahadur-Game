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
import { bgmAudio, winAudio } from "./components/audio";
import { muteOption } from "./components/mute";
import {
  drawHealthBar,
  writeBullet,
  writeLevel,
  writeScore,
} from "./components/scores";
//initializing the variables for preloading
let tileMap: TileMap;
let player: Player;
let lastFrameTime = performance.now();
const image = new Image();
image.src = singleWater;
/**
 * event listeners for play, mute, pause and shoot
 */
const setupEventListeners = () => {
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    keys[e.key] = true;
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
  });
};
/**
 * initialize the maps and player
 * @param level: level of the player
 */
const drawObjects = (level: number) => {
  tileMap = new TileMap(level);
  player = new Player({ x: 20, y: 100 }, 120, 60);
  tileMap.drawMap(player);
  quizMap.quizMap = new Quiz();
};
/**
 * this function starts the game time, stores it and passes it to updateGameState function
 * @param currentTime takes the game time
 */
const gameLoop = (currentTime: number) => {
  if (!gameStatus.isPaused) {
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    updateGameState(deltaTime);
  }

  requestAnimationFrame(gameLoop);
};
/**
 * this function draws objects from tilemap and update player position
 * @param deltaTime gametime
 */
const moveObjects = (deltaTime: number) => {
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
};
/**
 * Based on the gamestate and the options of the homescreen the screen are rendered
 * @param deltaTime gametime
 */
const updateGameState = (deltaTime: number) => {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  switch (gameState.currentState) {
    case GameState.Start:
      if (!audioLevel.isMuted && bgmAudio.paused) {
        bgmAudio.play();
        bgmAudio.autoplay = true;
        bgmAudio.play();
        bgmAudio.volume = 0.8;
      }
      if (menuOptions.option == "Start" || menuOptions.option == "Play") {
        startGame();
      } else if (menuOptions.option == "Instruction") {
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

      moveObjects(deltaTime);

      if (gameStatus.isQuiz && quizMap.quizMap != null) {
        quizMap.quizMap.draw();
      }

      writeBullet(image);
      writeScore();
      writeLevel();
      drawHealthBar();
      break;
    case GameState.GameOver:
      gameOverFunction();
      break;
  }
};
/**
 * restart the gameloop by initializing the variables
 * @param value define the level default it is level 1 if value=1 then level2
 */
const startGame = (value?: number) => {
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
  if (winAudio.played) winAudio.pause();
  if (menuOptions.option == "Start") {
    drawObjects(1);
  }
  if (levelGrade.success == "success" && value == 1) {
    drawObjects(2);
  }
  if (
    isCustom.custom == true &&
    (menuOptions.option == "Editor" || menuOptions.option == "Play")
  ) {
    drawObjects(-1);
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
//start the gameloop
requestAnimationFrame(gameLoop);
