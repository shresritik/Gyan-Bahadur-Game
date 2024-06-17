import { ctx } from "../components/canvas";
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
  bulletDirectionRight: boolean = true;
  constructor(
    position: { x: number; y: number },
    h: number,
    w: number,
    bulletDirectionRight: boolean
  ) {
    super(position, h, w);
    this.bulletDirectionRight = bulletDirectionRight;
    this.velocityX = SPEED * 2;
  }

  drawBullet() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 8, 0, 2 * Math.PI, true);
    ctx.fill();
  }

  // Method to move the bullet
  moveBulletX() {
    if (this.bulletDirectionRight) this.position.x += this.velocityX;
    else this.position.x -= this.velocityX;
  }
}
