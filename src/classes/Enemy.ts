import { ctx } from "../components/canvas";
import {
  SPEED,
  scoreCount,
  objects,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from "../constants/constants";
import {
  backgroundMovement,
  detectCollision,
  getDistance,
} from "../utils/utils";
import { Base } from "./Base";
import { Player } from "./Player";
import fireImg from "../assets/images/fire.png";
import coronaImg from "../assets/images/virus2.png";
import { Bullet } from "./Bullet";
import { Plat } from "./Platform";
import { coronaAudio, damageAudio, fireAudio } from "../components/audio";
import { Frame } from "../types/types";
import Particle from "./Particle";
import { IEnemy } from "../interface/interface";

export class Enemy extends Base implements IEnemy {
  private imageX: number = 0;
  private enemyFrame: Frame = {
    width: 126,
    height: 254,
  };
  private coronaFrame: Frame = {
    width: 776,
    height: 771,
    framex: 0,
  };
  private hitEnemy: boolean = false;
  private elapsedFrame = 0;
  tile: number = 0;
  enemyBullet: Bullet[] = [];
  bulletInterval: number | undefined;
  lastHealthDecreaseTime: number = 0; // Last time health was decreased
  healthDecreaseCooldown: number = 800; // Cooldown period in milliseconds
  private bulletIndex: number = 0;
  private fireImage: HTMLImageElement;
  private coronaImage: HTMLImageElement;
  private directionX: number;
  private particles: Particle[] = [];
  constructor(
    position: { x: number; y: number },
    w: number,
    h: number,
    tile: number
  ) {
    super(position, h, w);
    this.tile = tile;
    this.directionX = 1;

    this.fireImage = new Image();
    this.fireImage.src = fireImg;

    this.coronaImage = new Image();
    this.coronaImage.src = coronaImg;
  }

  startShooting(player: Player) {
    this.bulletInterval = setInterval(() => this.createBullet(player), 3000); // create bullet objects every 3 seconds
  }

  draw = () => {
    const image = this.tile === 4 ? this.fireImage : this.coronaImage;
    if (this.tile == 4) {
      ctx.drawImage(
        image,
        this.imageX * this.enemyFrame.width,
        0,
        this.enemyFrame.width,
        this.enemyFrame.height,
        this.position.x,
        this.position.y,
        80,
        100
      );
    } else if (this.tile == 5) {
      ctx.drawImage(
        image,
        this.coronaFrame.framex! * this.coronaFrame.width,
        0,
        this.coronaFrame.width,
        this.coronaFrame.height,
        this.position.x,
        this.position.y,
        80,
        80
      );
    }
    this.updateParticles();
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
      0
    );
    this.enemyBullet.push(bullet);
    objects.enemyBullet.push(bullet);
  };
  //remove bullet if not in the canvas
  private checkBoundary(singleBullet: Bullet, index: number) {
    if (
      singleBullet.position.x <= 0 ||
      singleBullet.position.x >= CANVAS_WIDTH ||
      singleBullet.position.y <= 0 ||
      singleBullet.position.y >= CANVAS_HEIGHT
    ) {
      this.enemyBullet.splice(index, 1);
      objects.enemyBullet.splice(index, 1);
    }
  }
  //if player and enemy less than 1000 than enemy starts shooting
  //if the bullet collides with enemy decrease health and bullet
  updateEnemyBullet = (player: Player, deltatime: number) => {
    this.enemyBullet.forEach((singleBullet, index) => {
      this.checkBoundary(singleBullet, index);

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
          this.createParticles(singleBullet.position, "red"); // Create particles when enemy bullet hits player
          if (scoreCount.health > 0 && !this.hitEnemy) {
            scoreCount.health -= 5;
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
  // if enemy collides with player decrease the health
  playerCollision = (player: Player) => {
    const currentTime = Date.now();
    if (detectCollision(player, this)) {
      damageAudio.play();

      if (
        scoreCount.health > 0 &&
        currentTime - this.lastHealthDecreaseTime > this.healthDecreaseCooldown
      ) {
        scoreCount.health -= 5;
        this.lastHealthDecreaseTime = currentTime;
      }
    }
  };
  // if enemy collides with platform then change the enemy direction
  platformCollision = (platform: Plat) => {
    if (detectCollision(this, platform)) {
      this.directionX *= -1;
    }
  };
  private createParticles(
    position?: { x: number; y: number },
    color = "#1371F7"
  ) {
    const particleCount = 20;
    const posX = position ? position.x : this.position.x + this.w / 2;
    const posY = position ? position.y : this.position.y + this.h / 2;
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 10 + 2;
      const velocity = {
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4,
      };
      const particle = new Particle(
        { x: posX, y: posY },
        velocity,
        size,
        color
      );
      this.particles.push(particle);
    }
  }

  //enemy bullet logic
  enemyBulletCollision = () => {
    objects.bullet.forEach((bull, index) => {
      if (detectCollision(bull, this)) {
        damageAudio.play();
        this.createParticles();
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

  private updateParticles() {
    this.particles = this.particles.filter((particle) => particle.isAlive());
    this.particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
  }
  moveX = (player: Player, deltaTime: number) => {
    this.elapsedFrame++;
    if (this.elapsedFrame % 15 === 0) this.imageX++;
    if (this.imageX >= 7) this.imageX = 0;
    this.elapsedFrame++;
    if (this.elapsedFrame % 28 === 0) this.coronaFrame.framex!++;
    if (this.coronaFrame.framex! >= 9) this.coronaFrame.framex = 0;

    backgroundMovement(player, this, deltaTime);

    if (this.tile === 5) {
      this.position.x += this.directionX * SPEED * (deltaTime / 16.67);

      if (this.position.x <= 0 || this.position.x + this.w >= CANVAS_WIDTH) {
        this.directionX *= -1;
      }

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
