import { Platform } from "./classes/Platform";
import { Player } from "./classes/Player";
import { ctx } from "./components/canvas";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants/constants";
import "./style.css";

// main game function calls
let lastFrameTime: number = 0;
let platform: Platform;
let player: Player;

const drawObjects = () => {
  platform = new Platform(32);
  player = new Player({ x: 20, y: 50 }, 50, 50);
};
function gameLoop(currentTime: number) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  player.draw();
  player.moveY(currentTime);
  player.moveX(currentTime);
  platform.drawMap(player);
  // const deltaTime = currentTime - lastFrameTime;
  // lastFrameTime = currentTime;
  requestAnimationFrame(gameLoop);
}

// Start the game loop initially
drawObjects();
gameLoop(0);
