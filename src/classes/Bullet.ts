import { ctx } from "../components/canvas";
import { SPEED } from "../constants/constants";
import { Base } from "./Base";
import firer from "../assets/firer.png";
import water from "../assets/water.png";
import corona from "../assets/corona.png";

let frameX = 0;
let frameY = 0;
const frameInterval = 1000 / 5; // 5 frames per second

export class Bullet extends Base {
  velocityDirection: { x: number };
  fireFrame: {
    fireWidth: number;
    fireHeight: number;
    fireFrame: number;
  } = {
    fireWidth: 254,
    fireHeight: 126,
    fireFrame: 20,
  };
  firerImg: HTMLImageElement;
  coronaImg: HTMLImageElement;
  waterImg: HTMLImageElement;
  accumulatedTime: number;
  angle: number;
  bulletSpeed: number = 2;
  constructor(
    position: { x: number; y: number },
    h: number,
    w: number,
    direction: { x: number },
    angle: number
  ) {
    super(position, h, w);
    this.velocityDirection = { x: direction.x };
    this.firerImg = new Image();
    this.firerImg.src = firer;
    this.coronaImg = new Image();
    this.coronaImg.src = corona;
    this.waterImg = new Image();
    this.waterImg.src = water;
    this.accumulatedTime = 0;
    this.angle = angle;
  }

  drawBullet(deltaTime: number, tile?: number) {
    this.accumulatedTime += deltaTime;

    if (this.accumulatedTime >= frameInterval) {
      frameY++;
      this.accumulatedTime = 0;
    }

    if (tile === 4) {
      if (frameY >= 6) frameY = 0;
      if (this.velocityDirection.x == -1) {
        ctx.drawImage(
          this.firerImg,
          frameX * this.fireFrame.fireWidth,
          frameY * this.fireFrame.fireHeight,
          this.fireFrame.fireWidth,
          this.fireFrame.fireHeight,
          this.position.x,
          this.position.y,
          this.w,
          this.h
        );
      } else {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
          this.firerImg,
          frameX * this.fireFrame.fireWidth,
          frameY * this.fireFrame.fireHeight,
          this.fireFrame.fireWidth,
          this.fireFrame.fireHeight,
          -this.position.x,
          this.position.y,
          this.w,
          this.h
        );
        ctx.restore();
      }
    } else if (tile === 5) {
      ctx.drawImage(this.coronaImg, this.position.x, this.position.y, 32, 32);
    } else {
      if (frameY >= 6) frameY = 0;
      if (this.velocityDirection.x == -1) {
        ctx.drawImage(
          this.waterImg,
          frameX * this.fireFrame.fireWidth,
          frameY * this.fireFrame.fireHeight,
          this.fireFrame.fireWidth,
          this.fireFrame.fireHeight,
          this.position.x,
          this.position.y,
          this.w,
          this.h
        );
      } else {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
          this.waterImg,
          frameX * this.fireFrame.fireWidth,
          frameY * this.fireFrame.fireHeight,
          this.fireFrame.fireWidth,
          this.fireFrame.fireHeight,
          -this.position.x - this.w,
          this.position.y,
          this.w,
          this.h
        );
        ctx.restore();
      }
    }
  }

  moveBullet(deltaTime: number) {
    const movementSpeed = ((SPEED * deltaTime) / 16.67) * this.bulletSpeed;
    if (this.position.y <= 300) {
      // If bullet reaches certain height (100 in this example), change direction to move downwards
      this.angle = -(3 * Math.PI) / 4; // Example downward angle (45 degrees in radians), adjust as needed
    }

    if (this.angle !== 0) {
      // Calculate velocities based on angle
      const angleDirection = this.velocityDirection.x * movementSpeed;
      const vx = -angleDirection * Math.cos(this.angle);
      const vy =
        this.velocityDirection.x == 1
          ? -angleDirection * Math.sin(this.angle)
          : angleDirection * Math.sin(this.angle);

      // Update position
      this.position.x += vx;
      this.position.y += vy; // Invert y because canvas y-axis is typically inverted
    } else {
      // Update position with only horizontal movement
      this.position.x += this.velocityDirection.x * movementSpeed;
    }
  }
}
