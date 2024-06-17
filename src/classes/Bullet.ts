import { SPEED } from "../constants/constants";
import { detectCollision } from "../utils/utils";
import { Base } from "./Base";
import { Enemy } from "./Enemy";
import { Player, TKeys } from "./Player";

export class Bullet extends Base {
  keys: TKeys = {};

  velocityX = 12;
  bullet: number | null = null;
  bulletSpeed: number | null = 0.5;

  constructor(position: { x: number; y: number }, h: number, w: number) {
    super(position, h, w);

    this.velocityX = SPEED * 2;
  }

  drawBullet(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 8, 0, 2 * Math.PI, true);
    ctx.fill();
  }

  // Method to move the bullet
  moveBulletX(deltaTime: number, player: Player) {
    // if (player.keys["d"] && player.position.x >= 300)
    this.position.x += this.velocityX;
    // else if (player.keys["a"] && player.position.x >= 300)
    // this.position.x += this.velocityX;
  }
}
