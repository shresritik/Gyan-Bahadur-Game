import { ctx } from "../components/canvas";
import { CANVAS_WIDTH, SPEED } from "../constants/constants";

import { Base } from "./Base";

interface IPlayer {
  position: { x: number; y: number };
  h: number;
  w: number;
  // image: HTMLImageElement;
}
export interface TKeys {
  [keys: string]: boolean;
}

export class Player extends Base implements IPlayer {
  // image: HTMLImageElement;
  keys: TKeys = {};
  velocityY = -7;
  gravity = 0.3;

  maxHeight = 0;
  platformY = 0;
  constructor(position: { x: number; y: number }, h: number, w: number) {
    super({ x: position.x, y: position.y, bulletY: position.y }, h, w);

    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.keyUpHandler = this.keyUpHandler.bind(this);

    document.addEventListener("keydown", this.keyDownHandler);
    document.addEventListener("keyup", this.keyUpHandler);
  }

  keyDownHandler(e: KeyboardEvent) {
    this.keys[e.key] = true;
  }

  keyUpHandler(e: KeyboardEvent) {
    this.keys[e.key] = false;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.w, this.h);
    // ctx.drawImage(this.image, this.position.x, this.position.y, this.w, this.h);
  }

  moveX(deltaTime: number) {
    const movementSpeed = (SPEED * deltaTime) / deltaTime; // Normalize to 60 FPS

    if (this.keys["a"] && this.position.x < 300) {
      this.position.x -= movementSpeed;
    }
    if (this.keys["d"] && this.position.x < 300) {
      this.position.x += movementSpeed;
    }

    this.checkBoundaryX();
  }

  moveY() {
    // Initially velocityY is negative so it moves upward and after adding gravity it moves downward
    this.position.y += this.velocityY; // Normalize to 60 FPS
    this.velocityY += this.gravity; // Normalize to 60 FPS
    // this.checkBoundaryY();

    if (this.keys["w"] && this.position.y + this.h >= this.platformY) {
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
}
