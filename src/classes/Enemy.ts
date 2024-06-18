import { ctx } from "../components/canvas";
import {
  SPEED,
  scoreCount,
  keys,
  objects,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from "../constants/constants";
import { detectCollision, getDistance, normalizeVector } from "../utils/utils";
import { Base } from "./Base";
import { Player } from "./Player";
import fireImg from "../assets/fire.png";
import coronaImg from "../assets/corona.png";
import { Bullet } from "./Bullet";

export class Enemy extends Base {
  imageX: number = 0;
  imageY: number = 0;
  spriteWidth = 0;
  spriteHeight = 0;
  hitEnemy: boolean = false;
  elapsedFrame = 0;
  tile: number = 0;
  enemyBullet: Bullet[] = [];
  bulletInterval: number | undefined;
  lastHealthDecreaseTime: number = 0; // Last time health was decreased
  healthDecreaseCooldown: number = 1000; // Cooldown period in milliseconds

  constructor(
    position: { x: number; y: number },
    w: number,
    h: number,
    tile: number
  ) {
    super(position, h, w);
    this.imageX = 0;
    this.imageY = 39;
    this.spriteWidth = 126;
    this.spriteHeight = 254;
    this.hitEnemy = false;
    this.tile = tile;
  }

  startShooting(player: Player) {
    this.bulletInterval = setInterval(() => this.drawBullet(player), 3000); // Shoot bullet every 3 seconds
  }

  draw = () => {
    const image = new Image();
    if (this.tile == 4) {
      image.src = fireImg;
      ctx.drawImage(
        image,
        this.imageX * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.position.x,
        this.position.y,
        this.w,
        this.h
      );
    } else if (this.tile == 5) {
      image.src = coronaImg;
      ctx.drawImage(image, this.position.x - 10, this.position.y - 10, 50, 50);
    }
  };

  drawBullet = (player: Player) => {
    const direction = normalizeVector({
      x: player.position.x - this.position.x,
      y: player.position.y - this.position.y,
    });

    const bullet = new Bullet(
      { x: this.position.x, y: this.position.y },
      20,
      20,
      direction
    );
    this.enemyBullet.push(bullet);
  };

  updateBullet = (player: Player) => {
    this.enemyBullet.forEach((singleBullet, index) => {
      if (
        singleBullet.position.x <= 0 ||
        singleBullet.position.x >= CANVAS_WIDTH ||
        singleBullet.position.y <= 0 ||
        singleBullet.position.y >= CANVAS_HEIGHT
      ) {
        this.enemyBullet.splice(index, 1);
      }

      if (
        getDistance(
          player.position.x,
          player.position.y,
          this.position.x,
          this.position.y
        ) < 1000
      ) {
        singleBullet.drawBullet();
        singleBullet.moveBullet();

        if (detectCollision(player, singleBullet)) {
          if (scoreCount.health > 0 && !this.hitEnemy) {
            scoreCount.health--;
            this.hitEnemy = true;
          }
          this.enemyBullet.splice(index, 1);
        } else {
          this.hitEnemy = false;
        }
      }
    });
  };

  playerCollision = (player: Player) => {
    const currentTime = Date.now();
    if (detectCollision(player, this)) {
      if (
        scoreCount.health > 0 &&
        currentTime - this.lastHealthDecreaseTime > this.healthDecreaseCooldown
      ) {
        scoreCount.health--;
        this.lastHealthDecreaseTime = currentTime; // Update the last decrease time
      }
    }
  };

  bulletCollision = (player: Player) => {
    player.bulletArray.forEach((bull, index) => {
      if (detectCollision(bull, this)) {
        scoreCount.score++;
        objects.enemy = objects.enemy.filter((enemy) => {
          if (enemy === this) {
            enemy.destroy();
            return false;
          }
          return true;
        });
        player.bulletArray.splice(index, 1);
      }
    });
  };

  moveX = (player: Player, deltaTime: number) => {
    this.elapsedFrame++;
    if (this.elapsedFrame % 15 === 0) this.imageX++;
    if (this.imageX >= 7) this.imageX = 0;
    const movementSpeed = (SPEED * deltaTime) / deltaTime;
    if (keys["d"] && player.position.x >= 300) this.position.x -= movementSpeed;
    else if (keys["a"] && player.position.x >= 300)
      this.position.x += movementSpeed;
  };

  destroy() {
    if (this.bulletInterval) {
      clearInterval(this.bulletInterval);
    }
  }
}
