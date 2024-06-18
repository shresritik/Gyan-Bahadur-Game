import { TileMap } from "./classes/TileMap";
import { Player } from "./classes/Player";
import { ctx } from "./components/canvas";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  objects,
  scoreCount,
} from "./constants/constants";
import "./style.css";

let platform: TileMap;
let player: Player;

const drawObjects = () => {
  platform = new TileMap();
  player = new Player({ x: 20, y: 50 }, 50, 50);
  platform.drawMap(player);
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

  platform.moveX(player, deltaTime);
  platform.drawEnemy(player, deltaTime);
  platform.drawFruit(player, deltaTime);

  player.updateBullet();

  objects.enemy.forEach((enemy) => {
    enemy.updateBullet(player);
    enemy.bulletCollision(player);
  });

  writeScore();
  requestAnimationFrame(gameLoop);
}

// Start the game loop initially
drawObjects();
requestAnimationFrame(gameLoop);
