import { ctx } from "../components/canvas";
import { CANVAS_WIDTH, SPEED, keys } from "../constants/constants";
import { Base } from "./Base";
import { Bullet } from "./Bullet";

interface IPlayer {
  position: { x: number; y: number };
  h: number;
  w: number;
}

export class Player extends Base implements IPlayer {
  velocityY = 0;
  gravity = 0.2;
  bulletArray: Bullet[] = [];
  directionRight: boolean = true;
  playerSpeed = 2;

  constructor(position: { x: number; y: number }, h: number, w: number) {
    super({ x: position.x, y: position.y, bulletY: position.y }, h, w);

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      keys[e.key] = true;
    });
    window.addEventListener("keyup", (e: KeyboardEvent) => {
      keys[e.key] = false;
    });
    window.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.key == "f") {
        this.drawBullet();
      }
    });
  }
  //draw player
  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.w, this.h);
  }
  //move left with a and right with d
  //if player.x is less than 300 then stop the movement

  moveX(deltaTime: number) {
    const movementSpeed = (SPEED * deltaTime) / 16.67;
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
  }

  checkBoundaryX() {
    if (this.position.x <= 0) {
      this.position.x = 0;
    } else if (this.position.x + this.w >= CANVAS_WIDTH) {
      this.position.x = CANVAS_WIDTH - this.w;
    }
  }
  //create bullet object
  drawBullet() {
    const bullet = new Bullet(
      { x: this.position.x + this.w / 2, y: this.position.y + this.h / 2 },
      10,
      10,
      { x: this.directionRight ? 1 : -1 }
    );
    this.bulletArray.push(bullet);
  }
  //update player's bullet
  updateBullet() {
    for (let i = 0; i < this.bulletArray.length; i++) {
      const bullet = this.bulletArray[i];
      bullet.drawBullet();
      bullet.moveBullet();
      if (bullet.position.x <= 0 || bullet.position.x >= CANVAS_WIDTH) {
        this.bulletArray.splice(i, 1);
        i--;
      }
    }
  }
}
