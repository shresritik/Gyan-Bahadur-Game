import { ctx } from "../components/canvas";
import { SPEED } from "../constants/constants";
import { Base } from "./Base";
import firer from "../assets/images/firer.png";
import water from "../assets/images/water.png";
import corona from "../assets/images/corona.png";
import { explosionAudio, waterAudio } from "../components/audio";
import { Frame } from "../types/types";
import { IBullet } from "../interface/interface";

let frameX = 0;
let frameY = 0;
const frameInterval = 1000 / 5; // 5 frames per second

export class Bullet extends Base implements IBullet {
  private velocityDirection: { x: number };
  private fireFrame: Frame = {
    width: 254,
    height: 126,
  };
  private firerImg: HTMLImageElement;
  private coronaImg: HTMLImageElement;
  private waterImg: HTMLImageElement;
  private accumulatedTime: number;
  angle: number;
  private bulletSpeed: number = 2;
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
  private drawFire() {
    explosionAudio.play();
    if (frameY >= 6) frameY = 0;
    if (this.velocityDirection.x == -1) {
      ctx.drawImage(
        this.firerImg,
        frameX * this.fireFrame.width,
        frameY * this.fireFrame.height,
        this.fireFrame.width,
        this.fireFrame.height,
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
        frameX * this.fireFrame.width,
        frameY * this.fireFrame.height,
        this.fireFrame.width,
        this.fireFrame.height,
        -this.position.x,
        this.position.y,
        this.w,
        this.h
      );
      ctx.restore();
    }
  }
  private drawWater() {
    waterAudio.play();
    if (frameY >= 6) frameY = 0;
    if (this.velocityDirection.x == -1) {
      ctx.drawImage(
        this.waterImg,
        frameX * this.fireFrame.width,
        frameY * this.fireFrame.height,
        this.fireFrame.width,
        this.fireFrame.height,
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
        frameX * this.fireFrame.width,
        frameY * this.fireFrame.height,
        this.fireFrame.width,
        this.fireFrame.height,
        -this.position.x - this.w,
        this.position.y,
        this.w,
        this.h
      );
      ctx.restore();
    }
  }
  drawBullet(deltaTime: number, tile?: number) {
    this.accumulatedTime += deltaTime;

    if (this.accumulatedTime >= frameInterval) {
      frameY++;
      this.accumulatedTime = 0;
    }

    if (tile === 4) {
      this.drawFire();
    } else if (tile === 5) {
      ctx.drawImage(this.coronaImg, this.position.x, this.position.y, 32, 32);
    } else {
      this.drawWater();
    }
  }
  // if bullet position is is less than 300 change the angle to downward direction
  private bulletProjectile(movementSpeed: number) {
    const angleDirection = movementSpeed;
    const vx = -angleDirection * Math.cos(this.angle);
    const vy =
      this.velocityDirection.x == 1
        ? -angleDirection * Math.sin(this.angle)
        : angleDirection * Math.sin(this.angle);

    this.position.x += vx;
    this.position.y += vy;
  }
  moveBullet(deltaTime: number) {
    const movementSpeed =
      this.velocityDirection.x *
      ((SPEED * deltaTime) / 16.67) *
      this.bulletSpeed;

    if (this.angle !== 0) {
      if (this.position.y <= 300) {
        this.angle = -(3 * Math.PI) / 4;
      }
      this.bulletProjectile(movementSpeed);
    } else {
      this.position.x += movementSpeed;
    }
  }
}
