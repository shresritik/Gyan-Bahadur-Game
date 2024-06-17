import { TileMap } from "./classes/TileMap";
import { Player } from "./classes/Player";
import { ctx } from "./components/canvas";
import { CANVAS_HEIGHT, CANVAS_WIDTH, scoreCount } from "./constants/constants";
import "./style.css";

// main game function calls
let platform: TileMap;
let player: Player;

const drawObjects = () => {
  platform = new TileMap();
  platform.drawMap();

  player = new Player({ x: 20, y: 50 }, 50, 50);
};
export function writeScore(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "red";
  ctx.font = "30px sans-serif";
  ctx.fillText(`Score: ${scoreCount.score}`, 10, 30);
}
function gameLoop(currentTime: number) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  player.draw();
  player.moveY();
  player.moveX(currentTime);

  platform.moveX(player, currentTime);
  platform.drawEnemy(player, currentTime);
  platform.drawFruit(player, currentTime);
  player.updateBullet(currentTime);
  writeScore(ctx);

  // const deltaTime = currentTime - lastFrameTime;
  // lastFrameTime = currentTime;
  requestAnimationFrame(gameLoop);
}

// Start the game loop initially
drawObjects();
gameLoop(0);
