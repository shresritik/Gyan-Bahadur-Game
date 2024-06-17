import { ctx } from "../components/canvas";
import { SPEED, objects, scoreCount } from "../constants/constants";
import { detectCollision } from "../utils/utils";
import { Base } from "./Base";
import { Player } from "./Player";
import fireImg from "../assets/fire.png";
export class Enemy extends Base {
  imageX: number = 0;
  imageY: number = 0;
  spriteWidth = 0;
  spriteHeight = 0;
  hitEnemy: boolean = false;
  constructor(position: { x: number; y: number }, w: number, h: number) {
    super(position, h, w);
    this.imageX = 0;
    this.imageY = 39;
    this.spriteWidth = 108;
    this.spriteHeight = 248;
    this.hitEnemy = false;
  }
  draw = () => {
    const image = new Image();
    image.src = fireImg;

    ctx.drawImage(
      image,
      this.imageX * this.spriteWidth,
      0,
      108,
      248,
      this.position.x,
      this.position.y,
      this.w,
      this.h
    );
  };
  playerCollision = (player: Player) => {
    if (detectCollision(player, this)) {
      if (scoreCount.score > 0 && !this.hitEnemy) {
        scoreCount.score--;
        this.hitEnemy = true;
      }
      // player.checkBoundaryY(this.position.y - player.h);
    } else {
      this.hitEnemy = false;
    }
  };
  bulletCollision = (player: Player) => {
    player.bulletArray.forEach((bull) => {
      if (detectCollision(bull, this)) {
        scoreCount.score++;
        objects.enemy.shift();
        player.bulletArray.length = 0;

        // player.checkBoundaryY(this.position.y - player.h);
      }
    });
    // player.checkBoundaryY(this.position.y - player.h);
  };
  moveX = (player: Player, deltaTime: number) => {
    const movementSpeed = (SPEED * deltaTime) / deltaTime;
    if (player.keys["d"] && player.position.x >= 300)
      this.position.x -= movementSpeed;
    else if (player.keys["a"] && player.position.x >= 300)
      this.position.x += movementSpeed;
    if (this.imageX < 7) this.imageX += 0.01;
    else this.imageX = 0;
  };
}