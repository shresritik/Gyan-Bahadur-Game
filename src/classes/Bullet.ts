import { ctx } from "../components/canvas";
import { SPEED } from "../constants/constants";
import { Base } from "./Base";

export class Bullet extends Base {
  velocity: { x: number };

  constructor(
    position: { x: number; y: number },
    h: number,
    w: number,
    direction: { x: number }
  ) {
    super(position, h, w);
    this.velocity = { x: direction.x }; // Example speed, adjust as needed
  }

  drawBullet() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.w / 2, 0, 2 * Math.PI, true);
    ctx.fill();
  }

  moveBullet() {
    this.position.x += this.velocity.x * SPEED;
  }
}
