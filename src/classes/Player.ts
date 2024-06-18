import { ctx } from "../components/canvas";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  SPEED,
  keys,
} from "../constants/constants";

import { Base } from "./Base";
import { Bullet } from "./Bullet";

interface IPlayer {
  position: { x: number; y: number };
  h: number;
  w: number;
}

export class Player extends Base implements IPlayer {
  velocityY = -7;
  gravity = 0.3;

  maxHeight = 0;
  platformY = 0;
  bulletArray: Bullet[] = [];
  directionRight: boolean = true;

  constructor(position: { x: number; y: number }, h: number, w: number) {
    super({ x: position.x, y: position.y, bulletY: position.y }, h, w);

    document.addEventListener("keypress", (e) => {
      if (e.key == "f") {
        this.drawBullet();
      }
    });
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.w, this.h);
  }

  moveX(deltaTime: number) {
    const movementSpeed = (SPEED * deltaTime) / deltaTime;
    if (this.position.x < 300) {
      if (keys["a"]) {
        this.directionRight = false;
        this.position.x -= movementSpeed;
      }
      if (keys["d"]) {
        this.directionRight = true;
        this.position.x += movementSpeed;
      }
      this.checkBoundaryX();
    }
    if (keys["a"]) {
      this.directionRight = false;
    }
    if (keys["d"]) {
      this.directionRight = true;
    }
  }

  moveY() {
    this.position.y += this.velocityY;
    this.velocityY += this.gravity;
    this.checkBoundaryY(CANVAS_HEIGHT);
    if (keys["w"] && this.position.y + this.h >= this.platformY) {
      this.velocityY -= 1.5;
    }
  }

  checkBoundaryX() {
    if (this.position.x <= 0) {
      this.position.x = 0;
    } else if (this.position.x + this.w >= CANVAS_WIDTH) {
      this.position.x = CANVAS_WIDTH - this.w;
    }
  }

  checkBoundaryY(platformY: number) {
    if (this.position.y + this.h >= platformY) {
      this.platformY = platformY;
      this.position.y = this.platformY;
      this.velocityY = 0;
    }
  }

  drawBullet() {
    const bullet = new Bullet(
      { x: this.position.x, y: this.position.y },
      20,
      30,
      { x: this.directionRight ? 1 : -1 }
    );
    this.bulletArray.push(bullet);
  }

  updateBullet() {
    this.bulletArray.forEach((bullet, index) => {
      bullet.drawBullet();
      bullet.moveBullet();
      if (bullet.position.x >= CANVAS_WIDTH) {
        this.bulletArray.splice(index, 1);
      }
    });
  }
}
