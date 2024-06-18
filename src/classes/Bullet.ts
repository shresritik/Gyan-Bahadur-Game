import { ctx } from "../components/canvas";
import { Base } from "./Base";

export class Bullet extends Base {
  velocityX: number;
  velocityY: number;
  direction: { x: number };

  constructor(
    position: { x: number; y: number },
    h: number,
    w: number,
    direction: { x: number }
  ) {
    super(position, h, w);
    this.velocityX = 6; // Set bullet speed (adjust as needed)
    this.velocityY = 6; // Set bullet speed (adjust as needed)
    this.direction = direction;
  }

  drawBullet() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 8, 0, 2 * Math.PI, true);
    ctx.fill();
  }

  moveBullet() {
    this.position.x += this.velocityX * this.direction.x;
  }
}
