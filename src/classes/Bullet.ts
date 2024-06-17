import { SPEED } from "../constants/constants";
import { Base } from "./Base";
import { TKeys } from "./Player";

export class Bullet extends Base {
  keys: TKeys = {};

  velocityX = 12;
  bullet: number | null = null;
  bulletSpeed: number | null = 0.5;

  constructor(position: { x: number; y: number }, h: number, w: number) {
    super(position, h, w);

    this.velocityX = 1.5;
  }

  drawBullet(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.position.x, this.position.y, 10, 8);
  }

  // Method to move the bullet
  moveBulletX(deltaTime: number) {
    this.position.x += this.velocityX * SPEED * (deltaTime / 16.67); // Normalize to 60 FPS
  }
}
