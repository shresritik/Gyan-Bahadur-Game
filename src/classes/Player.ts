import { ctx } from "../components/canvas";
import { CANVAS_WIDTH, SPEED, keys } from "../constants/constants";
import { Base } from "./Base";
import { Bullet } from "./Bullet";
import stance from "../assets/stance2.png";
import run from "../assets/run2.png";
import runLeft from "../assets/run-left.png";
import jump from "../assets/jump.png";
interface IPlayer {
  position: { x: number; y: number };
  h: number;
  w: number;
}
let frameX = 0;
let frameY = 0;

let gameFrame = 0;

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
  playerSpeed = 2;

  constructor(position: { x: number; y: number }, h: number, w: number) {
    super({ x: position.x, y: position.y, bulletY: position.y }, h, w);

    window.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.key == "f") {
        this.drawBullet();
      }
    });
  }
  //draw player
  draw() {
    // ctx.fillStyle = "red";
    // ctx.fillRect(this.position.x, this.position.y, this.w, this.h);
    const image = new Image();

    if (keys["d"]) {
      image.src = run;

      ctx.drawImage(
        image,

        frameX * this.runFrame.runWidth,
        frameY * this.runFrame.runHeight,
        this.runFrame.runWidth,
        this.runFrame.runHeight,
        this.position.x,
        this.position.y - 65,
        100,
        130
      );
      if (gameFrame % this.runFrame.runnerFrame == 0) {
        if (frameX < 1) frameX++;
        else frameX = 0;
      }
      gameFrame++;
    } else if (keys["a"]) {
      image.src = runLeft;

      ctx.drawImage(
        image,

        frameX * this.runFrame.runWidth,
        frameY * this.runFrame.runHeight,
        this.runFrame.runWidth,
        this.runFrame.runHeight,
        this.position.x,
        this.position.y - 65,
        100,
        130
      );
      if (gameFrame % this.runFrame.runnerFrame == 0) {
        if (frameX < 2) frameX++;
        else frameX = 0;
      }
      gameFrame++;
    } else if (keys["w"]) {
      image.src = jump;

      ctx.drawImage(
        image,

        (frameX + 1) * this.jumpFrame.jumpWidth,
        frameY * this.jumpFrame.jumpHeight,
        this.jumpFrame.jumpWidth,
        this.jumpFrame.jumpHeight,
        this.position.x,
        this.position.y,
        100,
        120
      );
      // if (gameFrame % this.jumpFrame.jumpFrame == 0) {
      //   if (frameX < 3) frameX++;
      //   else frameX = 0;
      // }
      // gameFrame++;
    } else {
      gameFrame = 0;
      image.src = stance;
      ctx.drawImage(
        image,
        frameX * this.stanceFrame.stanceWidth,
        frameY * this.stanceFrame.stanceHeight,
        this.stanceFrame.stanceWidth,
        this.stanceFrame.stanceHeight,
        this.position.x,
        this.position.y - 55,
        image.height,
        image.width
      );
      if (gameFrame % this.stanceFrame.stanceFrame == 0) {
        if (frameX < 3) frameX++;
        else frameX = 0;
      }
      gameFrame++;
    }
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
