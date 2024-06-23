import { ctx } from "../components/canvas";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  SPEED,
  ammoObj,
  keys,
  levelGrade,
  objects,
} from "../constants/constants";
import { Base } from "./Base";
import { Bullet } from "./Bullet";
import stanceImg from "../assets/stancer2.png";
import runImg from "../assets/runright-3.png";
import jumpImg from "../assets/jump2.png";
import shoot from "../assets/shoot.png";
import win from "../assets/win.png";
import { loseAudio, runAudio, winAudio } from "../components/audio";

interface IPlayer {
  position: { x: number; y: number };
  h: number;
  w: number;
}

let frameX = 0;
let frameY = 0;
let gameFrame = 0;
const frameInterval = 1000 / 12; // 12 frames per second
type Frame = {
  width: number;
  height: number;
};

export class Player extends Base implements IPlayer {
  stanceFrame: Frame = {
    width: 30,
    height: 52,
  };
  shootFrame: Frame = {
    width: 61,
    height: 81,
  };

  runFrame: Frame = {
    width: 45.5,
    height: 52,
  };

  velocityY = 0;
  gravity = 0.2;
  directionRight: boolean = true;
  cooldownTime = 0;

  // Preloaded images
  stanceImage: HTMLImageElement;
  runImage: HTMLImageElement;
  jumpImage: HTMLImageElement;
  winImage: HTMLImageElement;
  shootImage: HTMLImageElement;
  jetpackPickupTime: number | null = null;
  constructor(position: { x: number; y: number }, h: number, w: number) {
    super({ x: position.x, y: position.y, bulletY: position.y }, h, w);

    // Preload images
    this.stanceImage = new Image();
    this.stanceImage.src = stanceImg;

    this.runImage = new Image();
    this.runImage.src = runImg;

    this.jumpImage = new Image();
    this.jumpImage.src = jumpImg;
    this.shootImage = new Image();
    this.shootImage.src = shoot;
    this.winImage = new Image();

    this.winImage.src = win;
  }

  draw(deltaTime: number) {
    gameFrame += deltaTime;
    if (gameFrame >= frameInterval) {
      frameX++;
      gameFrame = 0;
    }

    if (keys["d"] || keys["ArrowRight"]) {
      runAudio.play();
      this.directionRight = true;

      if (frameX >= 8) frameX = 0;
      ctx.drawImage(
        this.runImage,
        frameX * this.runFrame.width,
        frameY * this.runFrame.height,
        this.runFrame.width,
        this.runFrame.height,
        this.position.x - 20,
        this.position.y + 10,
        100,
        130
      );
    } else if (keys["a"] || keys["ArrowLeft"]) {
      runAudio.play();

      this.directionRight = false;

      if (frameX >= 8) frameX = 0;
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.runImage,
        frameX * this.runFrame.width,
        frameY * this.runFrame.height,
        this.runFrame.width,
        this.runFrame.height,
        -this.position.x - this.runFrame.width - 40, // Adjust for the mirrored position
        this.position.y + 10,
        100,
        130
      );
      ctx.restore();
    } else if (keys["w"] || keys["ArrowUp"]) {
      if (this.directionRight) {
        ctx.drawImage(
          this.jumpImage,
          this.position.x,
          this.position.y,
          80,
          180
        );
      } else {
        ctx.save();

        ctx.scale(-1, 1);
        ctx.drawImage(
          this.jumpImage,
          -this.position.x - 80,
          this.position.y,
          80,
          180
        );
        ctx.restore();
      }

      frameX = 0;
    } else if (keys["f"] || keys["g"]) {
      if (frameX >= 2) frameX = 0;
      if (this.directionRight) {
        ctx.drawImage(
          this.shootImage,
          frameX * this.shootFrame.width,
          frameY * this.shootFrame.height,
          this.shootFrame.width,
          this.shootFrame.height,
          this.position.x,
          this.position.y,
          100,
          150
        );
      } else {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
          this.shootImage,
          frameX * this.shootFrame.width,
          frameY * this.shootFrame.height,
          this.shootFrame.width,
          this.shootFrame.height,
          -this.position.x - this.shootFrame.width,
          this.position.y,
          100,
          150
        );
        ctx.restore();
      }
    } else {
      if (levelGrade.success == "success") {
        winAudio.play();
        ctx.drawImage(this.winImage, this.position.x, this.position.y, 80, 150);
      } else if (levelGrade.success == "fail") {
        loseAudio.play();
      }
      if (!this.directionRight && levelGrade.success != "success") {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
          this.stanceImage,
          -this.position.x - this.stanceFrame.width - 40, // Adjust for the mirrored position
          this.position.y,
          80,
          150
        );
        ctx.restore();
      } else if (this.directionRight && levelGrade.success != "success") {
        ctx.drawImage(
          this.stanceImage,
          this.position.x,
          this.position.y,
          80,
          150
        );
      }

      frameX = 0; // Reset frameX when not running
    }
  }

  moveX(deltaTime: number) {
    const movementSpeed = SPEED * (deltaTime / 16.67);
    if (this.position.x < 300) {
      if (keys["a"] || keys["ArrowLeft"]) {
        this.position.x -= movementSpeed;
      }

      if (keys["d"] || keys["ArrowRight"]) {
        this.position.x += movementSpeed;
      }

      this.checkBoundaryX();
    }
  }

  moveY(deltaTime: number) {
    // If jetpackPickupTime is set and 10 seconds have passed, reset gravity and jetpackPickupTime
    if (this.jetpackPickupTime) {
      const elapsedTime = Date.now() - this.jetpackPickupTime;
      if (elapsedTime >= 10000) {
        this.gravity = 0.2; // Reset to original gravity value
        this.jetpackPickupTime = null;
      }
    }

    this.position.y += this.velocityY * (deltaTime / 16.67);
    this.velocityY += this.gravity * (deltaTime / 16.67);
    if (this.position.y <= 0) {
      this.position.y = 0;
    }
  }

  checkBoundaryX() {
    if (this.position.x <= 0) {
      this.position.x = 0;
    } else if (this.position.x + this.w >= CANVAS_WIDTH) {
      this.position.x = CANVAS_WIDTH - this.w;
    }
  }

  fireBullet(angleVal: number) {
    if (ammoObj.ammo > 0) {
      ammoObj.ammo--; // Decrease ammo count
      const bulletDirection = this.directionRight ? 1 : -1;

      const bullet = new Bullet(
        {
          x: this.directionRight
            ? this.position.x + this.w
            : this.position.x - 50,
          y: this.position.y + 20,
        },
        50,
        80,
        { x: bulletDirection },
        Math.PI - angleVal
      );
      objects.bullet.push(bullet);
    }
  }

  updateBullet(deltaTime: number) {
    for (let i = 0; i < objects.bullet.length; i++) {
      const bullet = objects.bullet[i];
      bullet.drawBullet(deltaTime);
      bullet.moveBullet(deltaTime);

      if (
        bullet.position.x <= 0 ||
        bullet.position.x >= CANVAS_WIDTH ||
        bullet.position.y <= 0 ||
        bullet.position.y >= CANVAS_HEIGHT
      ) {
        objects.bullet.splice(i, 1);
        i--;
      }
    }
  }
}
