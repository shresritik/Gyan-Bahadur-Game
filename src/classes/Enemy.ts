import { ctx } from "../components/canvas";
import { SPEED, scoreCount, keys, objects } from "../constants/constants";
import { detectCollision, getDistance } from "../utils/utils";
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
  bulletInterval: number;

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
    this.bulletInterval = setInterval(this.drawBullet, 3000); // Shoot bullet every second
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

  drawBullet = () => {
    const bullet = new Bullet(
      { x: this.position.x, y: this.position.y },
      20,
      20,
      false
    );
    this.enemyBullet.push(bullet);
  };

  updateBullet = (player: Player) => {
    this.enemyBullet.forEach((singleBullet, index) => {
      if (
        getDistance(
          player.position.x,
          player.position.y,
          this.position.x,
          this.position.y
        ) < 1000
      ) {
        singleBullet.drawBullet();
        singleBullet.moveBulletX();
        if (singleBullet.position.x <= 0) {
          this.enemyBullet.splice(index, 1);
        }
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
    if (detectCollision(player, this)) {
      if (scoreCount.health > 0 && !this.hitEnemy) {
        scoreCount.health--;
        this.hitEnemy = true;
      }
    } else {
      this.hitEnemy = false;
    }
  };

  bulletCollision = (player: Player) => {
    player.bulletArray.forEach((bull, index) => {
      if (detectCollision(bull, this)) {
        scoreCount.score++;
        objects.enemy = objects.enemy.filter((enemy) => {
          if (enemy === this) {
            enemy.destroy(); // Call destroy to clear the interval
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

  // Clear interval when the enemy is removed
  destroy() {
    clearInterval(this.bulletInterval);
  }
}
