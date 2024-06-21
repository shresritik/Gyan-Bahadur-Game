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

  constructor(
    position: { x: number; y: number },
    h: number,
    w: number,
    direction: { x: number }
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
      ctx.drawImage(
        this.coronaImg,
        this.position.x,
        this.position.y - 10,
        32,
        32
      );
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
    this.position.x += this.velocityDirection.x * ((SPEED * deltaTime) / 16.67);
  }
}
