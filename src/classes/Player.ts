import { ctx } from "../components/canvas";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  SPEED,
  ammoObj,
  frameInterval,
  gameStatus,
  keys,
  levelGrade,
  objects,
} from "../constants/constants";
import { Base } from "./Base";
import { Bullet } from "./Bullet";
import stanceImg from "../assets/images/stancer2.png";
import runImg from "../assets/images/runright-3.png";
import jumpImg from "../assets/images/jump2.png";
import shoot from "../assets/images/shoot.png";
import win from "../assets/images/win.png";
import {
  loseAudio,
  rocketAudio,
  runAudio,
  winAudio,
} from "../components/audio";
import jet from "../assets/images/jetpack2.png";
import { Frame } from "../types/types";
import { IPlayer } from "../interface/interface";

let frameX = 0;
let frameY = 0;
let gameFrame = 0;

export class Player extends Base implements IPlayer {
  private stanceFrame: Frame = {
    width: 30,
    height: 52,
  };
  private shootFrame: Frame = {
    width: 61,
    height: 81,
  };

  private runFrame: Frame = {
    width: 45.5,
    height: 52,
  };
  private jetFrame: Frame = {
    width: 508,
    height: 523,
    framex: 0,
  };

  velocityY = 0;
  gravity = 0.2;
  directionRight: boolean = true;

  // Preloaded images
  private stanceImage: HTMLImageElement;
  private runImage: HTMLImageElement;
  private jumpImage: HTMLImageElement;
  private winImage: HTMLImageElement;
  private shootImage: HTMLImageElement;
  private jetImg: HTMLImageElement;
  jetpackPickupTime: number | null = null;
  constructor(position: { x: number; y: number }, h: number, w: number) {
    super({ x: position.x, y: position.y, bulletY: position.y }, h, w);
    this.jetImg = new Image();
    this.jetImg.src = jet;

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
  private drawJetPack(deltaTime: number) {
    if (this.jetpackPickupTime) {
      rocketAudio.play();
      rocketAudio.volume = 0.5;
      rocketAudio.autoplay = true;

      if (this.jetFrame.framex! >= 3) this.jetFrame.framex = 0;
      gameFrame += deltaTime;
      if (gameFrame >= 1000 / 12) {
        this.jetFrame.framex!++;
        gameFrame = 0;
      }
      ctx.drawImage(
        this.jetImg,
        this.jetFrame.framex! * this.jetFrame.width,
        0 * this.jetFrame.height,
        this.jetFrame.width,
        this.jetFrame.height,
        this.position.x,
        this.position.y + 30,
        50,
        60
      );
    }
  }
  private drawRunRight() {
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
  }
  private drawRunLeft() {
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
      -this.position.x - this.runFrame.width - 40,
      this.position.y + 10,
      100,
      130
    );
    ctx.restore();
  }
  private drawJump() {
    if (this.directionRight) {
      ctx.drawImage(this.jumpImage, this.position.x, this.position.y, 80, 180);
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
  }
  private drawShootBullet() {
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
  }
  private drawSuccess() {
    winAudio.play();
    ctx.drawImage(
      this.winImage,
      this.position.x,
      this.position.y + 10,
      80,
      125
    );
  }
  private drawStanceRight() {
    ctx.drawImage(this.stanceImage, this.position.x, this.position.y, 80, 150);
  }
  private drawStanceLeft() {
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
  }
  draw(deltaTime: number) {
    gameFrame += deltaTime;

    if (gameFrame >= frameInterval) {
      frameX++;
      gameFrame = 0;
    }
    this.drawJetPack(deltaTime);
    if ((keys["d"] || keys["ArrowRight"]) && !this.jetpackPickupTime) {
      runAudio.play();
      this.drawRunRight();
    } else if ((keys["a"] || keys["ArrowLeft"]) && !this.jetpackPickupTime) {
      runAudio.play();
      this.drawRunLeft();
    } else if ((keys["w"] || keys["ArrowUp"]) && !this.jetpackPickupTime) {
      this.drawJump();
    } else if (keys["f"] || keys["g"]) {
      this.drawShootBullet();
    } else {
      if (levelGrade.success == "success") {
        this.drawSuccess();
      } else if (levelGrade.success == "fail") {
        loseAudio.play();
      }
      if (
        !this.directionRight &&
        levelGrade.success != "success" &&
        !this.jetpackPickupTime
      ) {
        this.drawStanceLeft();
      } else if (
        this.directionRight &&
        levelGrade.success != "success" &&
        !this.jetpackPickupTime
      ) {
        this.drawStanceRight();
      }
      if ((keys["d"] || keys["ArrowRight"]) && this.jetpackPickupTime) {
        this.drawStanceRight();
      } else if ((keys["a"] || keys["ArrowLeft"]) && this.jetpackPickupTime) {
        this.drawStanceLeft();
      } else if (this.jetpackPickupTime) {
        this.drawStanceRight();
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
  private drawJetTimer(
    elapsedTime: number,

    x = 15,
    y = 85,
    width = 200,
    height = 20,
    maxTime: number = 10000
  ) {
    ctx.fillStyle = "#000";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "white";

    const healthWidth = (1 - elapsedTime / maxTime) * width;
    ctx.fillText(` ${Math.floor((healthWidth * 100) / 200)}%`, 215, 103);

    ctx.fillStyle = "#00C1EE";
    ctx.fillRect(x, y, healthWidth, height);

    ctx.strokeStyle = "fff";
    ctx.strokeRect(x, y, width, height);
  }
  // If jetpackPickupTime is set and 10 seconds have passed, reset gravity and jetpackPickupTime
  moveY(deltaTime: number) {
    if (this.jetpackPickupTime) {
      let elapsedTime = Date.now() - this.jetpackPickupTime;
      this.drawJetTimer(elapsedTime);
      if (elapsedTime >= 10000) {
        this.gravity = 0.2;
        this.jetpackPickupTime = null;
      }
    }

    this.position.y += this.velocityY * (deltaTime / 16.67);
    this.velocityY += this.gravity * (deltaTime / 16.67);
    this.checkBoundaryY();
  }

  private checkBoundaryX() {
    if (this.position.x <= 0) {
      this.position.x = 0;
    } else if (this.position.x + this.w >= CANVAS_WIDTH) {
      this.position.x = CANVAS_WIDTH - this.w;
    }
  }
  private checkBoundaryY() {
    if (this.position.y <= 0) {
      this.position.y = 0;
    } else if (this.position.y >= CANVAS_HEIGHT) {
      loseAudio.play();
      gameStatus.gameOver = true;
    }
  }
  /**
   * initalize the bullet
   * @param angleVal projectile angle in radian
   */
  fireBullet(angleVal: number) {
    if (ammoObj.ammo > 0) {
      ammoObj.ammo--;
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
  //update bullet poisition and remove it if not in canvas
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
