import { canvas, ctx } from "./components/canvas";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  objects,
  scoreCount,
  keys,
  gameStatus,
  quizMap,
  TKeys,
} from "./constants/constants";
import { Player } from "./classes/Player";
import { TileMap } from "./classes/TileMap";
import "./style.css";
import { Quiz } from "./classes/Quiz";
import { handleFullScreen } from "./utils/utils";

let tileMap: TileMap;
let player: Player;

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

export function writeScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText(`Score: ${scoreCount.score}`, 15, 35);
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

let lastFrameTime = 0;

function gameLoop(currentTime: number) {
  const deltaTime = currentTime - lastFrameTime;
  lastFrameTime = currentTime;

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  player.draw();
  player.moveY();
  player.moveX(deltaTime);

  tileMap.moveX(player, deltaTime);
  tileMap.drawEnemy(player, deltaTime);
  tileMap.drawFruit(player, deltaTime);
  tileMap.drawFlag(player, deltaTime);
  tileMap.drawAnimal(player, deltaTime);
  player.updateBullet();

  objects.enemy.forEach((enemy) => {
    enemy.updateEnemyBullet(player);
    enemy.enemyBulletCollision(player);
  });
  if (gameStatus.isQuiz && quizMap.quizMap != null) {
    quizMap.quizMap.draw();
  }
  writeScore();
  drawHealthBar();
  requestAnimationFrame(gameLoop);
}

// Start the game loop initially

handleFullScreen();

drawObjects();
requestAnimationFrame(gameLoop);
