import { ctx } from "../components/canvas";
import {
  SPEED,
  scoreCount,
  keys,
  objects,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from "../constants/constants";
import { detectCollision, getDistance } from "../utils/utils";
import { Base } from "./Base";
import { Player } from "./Player";
import fireImg from "../assets/fire.png";
import coronaImg from "../assets/corona.png";
import { Bullet } from "./Bullet";
import { Plat } from "./Platform";
import { coronaAudio, damageAudio, fireAudio } from "../components/audio";

export class Enemy extends Base {
  imageX: number = 0;
  imageY: number = 0;
  spriteWidth = 126;
  spriteHeight = 254;
  hitEnemy: boolean = false;
  elapsedFrame = 0;
  tile: number = 0;
  enemyBullet: Bullet[] = [];
  bulletInterval: number | undefined;
  lastHealthDecreaseTime: number = 0; // Last time health was decreased
  healthDecreaseCooldown: number = 800; // Cooldown period in milliseconds
  bulletIndex: number = 0;
  private static fireImage: HTMLImageElement;
  private static coronaImage: HTMLImageElement;
  directionX: number;

  constructor(
    position: { x: number; y: number },
    w: number,
    h: number,
    tile: number
  ) {
    super(position, h, w);
    this.tile = tile;
    this.directionX = 1;

    if (!Enemy.fireImage) {
      Enemy.fireImage = new Image();
      Enemy.fireImage.src = fireImg;
    }

    if (!Enemy.coronaImage) {
      Enemy.coronaImage = new Image();
      Enemy.coronaImage.src = coronaImg;
    }
  }

  startShooting(player: Player) {
    this.bulletInterval = setInterval(() => this.createBullet(player), 3000); // create bullet objects every 3 seconds
  }

  draw = () => {
    const image = this.tile === 4 ? Enemy.fireImage : Enemy.coronaImage;
    if (image.complete) {
      if (this.tile == 4) {
        ctx.drawImage(
          image,
          this.imageX * this.spriteWidth,
          0,
          this.spriteWidth,
          this.spriteHeight,
          this.position.x,
          this.position.y,
          80,
          100
        );
      } else if (this.tile == 5) {
        ctx.drawImage(image, this.position.x, this.position.y, 80, 80);
      }
    } else {
      image.onload = () => {
        if (this.tile == 4) {
          ctx.drawImage(
            image,
            this.imageX * this.spriteWidth,
            0,
            this.spriteWidth,
            this.spriteHeight,
            this.position.x,
            this.position.y,
            80,
            100
          );
        } else if (this.tile == 5) {
          ctx.drawImage(image, this.position.x, this.position.y, 80, 80);
        }
      };
    }
  };
  audioEnemy() {
    if (this.position.x <= CANVAS_WIDTH && this.position.x >= 0) {
      if (this.tile == 4) {
        fireAudio.play();
      } else if (this.tile == 5) {
        coronaAudio.play();
      }
    }
  }
  createBullet = (player: Player) => {
    const direction = this.position.x - player.position.x;
    const bullet = new Bullet(
      {
        x: this.position.x,
        y: this.tile == 4 ? this.position.y - 30 : this.position.y + 30,
      },
      50,
      80,
      { x: direction > 0 ? -1 : 1 },
      Math.PI
    );
    this.enemyBullet.push(bullet);
    objects.enemyBullet.push(bullet);
  };

  updateEnemyBullet = (player: Player, deltatime: number) => {
    this.enemyBullet.forEach((singleBullet, index) => {
      if (
        singleBullet.position.x <= 0 ||
        singleBullet.position.x >= CANVAS_WIDTH ||
        singleBullet.position.y <= 0 ||
        singleBullet.position.y >= CANVAS_HEIGHT
      ) {
        this.enemyBullet.splice(index, 1);
        objects.enemyBullet.splice(index, 1);
      }

      if (
        getDistance(
          player.position.x,
          player.position.y,
          this.position.x,
          this.position.y
        ) < 1000
      ) {
        singleBullet.drawBullet(deltatime, this.tile);
        singleBullet.moveBullet(deltatime);

        if (detectCollision(player, singleBullet)) {
          damageAudio.play();
          if (scoreCount.health > 0 && !this.hitEnemy) {
            scoreCount.health--;
            this.hitEnemy = true;
          }
          this.enemyBullet.splice(index, 1);
          objects.enemyBullet.splice(index, 1);
        } else {
          this.hitEnemy = false;
        }
      }
    });
  };

  playerCollision = (player: Player) => {
    const currentTime = Date.now();
    if (detectCollision(player, this)) {
      damageAudio.play();

      if (
        scoreCount.health > 0 &&
        currentTime - this.lastHealthDecreaseTime > this.healthDecreaseCooldown
      ) {
        scoreCount.health--;
        this.lastHealthDecreaseTime = currentTime; // Update the last decrease time
      }
    }
  };

  platformCollision = (platform: Plat) => {
    if (detectCollision(this, platform)) {
      this.directionX *= -1;
    }
  };

  enemyBulletCollision = () => {
    objects.bullet.forEach((bull, index) => {
      if (detectCollision(bull, this)) {
        damageAudio.play();
        if (this.tile == 5) {
          if (this.bulletIndex >= 2) {
            scoreCount.score++;
            objects.enemy = objects.enemy.filter((enemy) => {
              if (enemy === this) {
                enemy.destroy();
                return false;
              }
              return true;
            });
          } else {
            this.bulletIndex++;
          }
        } else {
          scoreCount.score++;
          objects.enemy = objects.enemy.filter((enemy) => {
            if (enemy === this) {
              enemy.destroy();
              return false;
            }
            return true;
          });
        }

        objects.bullet.splice(index, 1);
      }
    });
  };

  moveX = (player: Player, deltaTime: number) => {
    this.elapsedFrame++;
    if (this.elapsedFrame % 15 === 0) this.imageX++;
    if (this.imageX >= 7) this.imageX = 0;

    const movementSpeed = (SPEED * deltaTime) / 16.67;

    // Parallax effect for player movement
    if (keys["d"] && player.position.x >= 300) {
      this.position.x -= movementSpeed;
    } else if (keys["a"] && player.position.x >= 300) {
      this.position.x += movementSpeed;
    }

    // Move enemy if tile is 5
    if (this.tile === 5) {
      // Update position based on direction
      this.position.x += this.directionX * SPEED * (deltaTime / 16.67);

      // Check boundaries
      if (this.position.x <= 0 || this.position.x + this.w >= CANVAS_WIDTH) {
        this.directionX *= -1; // Change direction upon reaching canvas boundary
      }

      // Check platform collisions
      objects.platform.forEach((platform) => {
        this.platformCollision(platform);
      });
    }
  };

  destroy() {
    if (this.bulletInterval) {
      clearInterval(this.bulletInterval);
    }
  }
}
