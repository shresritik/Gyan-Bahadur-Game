import { ctx } from "../components/canvas";
import {
  CANVAS_WIDTH,
  SPEED,
  ammoObj,
  keys,
  objects,
} from "../constants/constants";
import { Base } from "./Base";
import { Bullet } from "./Bullet";
import stanceImg from "../assets/stancer2.png";
import runImg from "../assets/run2.png";
import runLeftImg from "../assets/run-left.png";
import jumpImg from "../assets/jump.png";

interface IPlayer {
  position: { x: number; y: number };
  h: number;
  w: number;
}

let frameX = 0;
let frameY = 0;
let gameFrame = 0;
const frameInterval = 1000 / 12; // 12 frames per second

export class Player extends Base implements IPlayer {
  stanceFrame: {
    stanceWidth: number;
    stanceHeight: number;
    stanceFrame: number;
  } = {
    stanceWidth: 30,
    stanceHeight: 52,
    stanceFrame: 0,
  };

  runFrame: {
    runWidth: number;
    runHeight: number;
    runnerFrame: number;
  } = {
    runWidth: 46,
    runHeight: 52,
    runnerFrame: 15,
  };

  jumpFrame: {
    jumpWidth: number;
    jumpHeight: number;
    jumpFrame: number;
  } = {
    jumpWidth: 44,
    jumpHeight: 55,
    jumpFrame: 20,
  };

  velocityY = 0;
  gravity = 0.2;
  bulletArray: Bullet[] = [];
  directionRight: boolean = true;
  cooldownTime = 0;
  cooldownPeriod = 1000; // Cooldown period in milliseconds

  // Preloaded images
  stanceImage: HTMLImageElement;
  runImage: HTMLImageElement;
  runLeftImage: HTMLImageElement;
  jumpImage: HTMLImageElement;

  constructor(position: { x: number; y: number }, h: number, w: number) {
    super({ x: position.x, y: position.y, bulletY: position.y }, h, w);

    // Preload images
    this.stanceImage = new Image();
    this.stanceImage.src = stanceImg;

    this.runImage = new Image();
    this.runImage.src = runImg;

    this.runLeftImage = new Image();
    this.runLeftImage.src = runLeftImg;

    this.jumpImage = new Image();
    this.jumpImage.src = jumpImg;
  }

  draw(deltaTime: number) {
    gameFrame += deltaTime;
    if (gameFrame >= frameInterval) {
      frameX++;
      gameFrame = 0;
    }

    if (keys["d"]) {
      if (frameX >= 3) frameX = 0;

      ctx.drawImage(
        this.runImage,
        frameX * this.runFrame.runWidth,
        frameY * this.runFrame.runHeight,
        this.runFrame.runWidth,
        this.runFrame.runHeight,
        this.position.x,
        this.position.y - 65,
        100,
        130
      );
    } else if (keys["a"]) {
      if (frameX >= 3) frameX = 0;

      ctx.drawImage(
        this.runLeftImage,
        frameX * this.runFrame.runWidth,
        frameY * this.runFrame.runHeight,
        this.runFrame.runWidth,
        this.runFrame.runHeight,
        this.position.x,
        this.position.y - 65,
        100,
        130
      );
    } else if (keys["w"]) {
      ctx.drawImage(
        this.jumpImage,
        (frameX + 1) * this.jumpFrame.jumpWidth,
        frameY * this.jumpFrame.jumpHeight,
        this.jumpFrame.jumpWidth,
        this.jumpFrame.jumpHeight,
        this.position.x,
        this.position.y,
        100,
        120
      );
      frameX = 0;
    } else {
      ctx.drawImage(
        this.stanceImage,
        this.position.x,
        this.position.y - 75,
        80,
        150
      );
      frameX = 0; // Reset frameX when not running
    }
  }

  moveX(deltaTime: number) {
    const movementSpeed = SPEED * (deltaTime / 16.67);
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

  moveY(deltaTime: number) {
    this.position.y += this.velocityY * (deltaTime / 16.67);
    this.velocityY += this.gravity * (deltaTime / 16.67);
  }

  checkBoundaryX() {
    if (this.position.x <= 0) {
      this.position.x = 0;
    } else if (this.position.x + this.w >= CANVAS_WIDTH) {
      this.position.x = CANVAS_WIDTH - this.w;
    }
  }

  fireBullet() {
    if (this.cooldownTime <= 0 && ammoObj.ammo > 0) {
      this.cooldownTime = this.cooldownPeriod; // Reset cooldown time
      ammoObj.ammo--; // Decrease ammo count
      const bulletDirection = this.directionRight ? 1 : -1;

      const bullet = new Bullet(
        { x: this.position.x + this.w / 2, y: this.position.y + this.h / 2 },
        10,
        10,
        { x: bulletDirection }
      );
      objects.bullet.push(bullet);
    }
  }

  updateBullet(deltaTime: number) {
    for (let i = 0; i < objects.bullet.length; i++) {
      const bullet = objects.bullet[i];
      bullet.drawBullet(deltaTime);
      bullet.moveBullet(deltaTime);

      if (bullet.position.x <= 0 || bullet.position.x >= CANVAS_WIDTH) {
        objects.bullet.splice(i, 1);
        i--;
      }
    }
  }

  updateCooldown(deltaTime: number) {
    if (this.cooldownTime > 0) {
      this.cooldownTime -= deltaTime;
    }
  }
}
