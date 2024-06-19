import { ctx } from "./components/canvas";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  objects,
  scoreCount,
  keys,
  gameStatus,
} from "./constants/constants";
import { Player } from "./classes/Player";
import { TileMap } from "./classes/TileMap";
import "./style.css";
import { Quiz } from "./classes/Quiz";

let tileMap: TileMap;
let player: Player;
export let quizMap: Quiz;

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
  quizMap = new Quiz();
  // player.createQuiz();
};

export function writeScore() {
  ctx.fillStyle = "red";
  ctx.font = "30px sans-serif";
  ctx.fillText(`Score: ${scoreCount.score}`, 10, 30);
  ctx.fillText(`Health: ${scoreCount.health}`, 150, 30);
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

  player.updateBullet();

  objects.enemy.forEach((enemy) => {
    enemy.updateEnemyBullet(player);
    enemy.enemyBulletCollision(player);
  });
  if (gameStatus.isQuiz) {
    quizMap.draw();
  }
  writeScore();

  requestAnimationFrame(gameLoop);
}

// Start the game loop initially
drawObjects();
requestAnimationFrame(gameLoop);
