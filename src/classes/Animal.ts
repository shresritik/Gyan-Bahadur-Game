import { Base } from "./Base";
import dog from "../assets/dogr2.png";
import { ctx } from "../components/canvas";
import { SPEED, keys, objects, scoreCount } from "../constants/constants";
import { Player } from "./Player";
import { detectCollision } from "../utils/utils";
let frameX = 0;
let frameY = 0;
const frameInterval = 1000 / 3;
let gameFrame = 0;
export class Animal extends Base {
  lastHealthDecreaseTime: number = 0; // Last time health was decreased
  healthDecreaseCooldown: number = 800; // Cooldown period in milliseconds
  tile: number = 0;
  dogFrame: {
    dogWidth: number;
    dogHeight: number;
    dogFrame: number;
  } = {
    dogWidth: 60,
    dogHeight: 64,
    dogFrame: 70,
  };
  dogImage: HTMLImageElement;
  constructor(
    position: { x: number; y: number },
    w: number,
    h: number,
    tile: number
  ) {
    super(position, h, w);
    this.tile = tile;
    this.dogImage = new Image();
    this.dogImage.src = dog;
  }

  drawAnimal = (deltaTime: number) => {
    gameFrame += deltaTime;
    if (gameFrame >= frameInterval) {
      frameX++;
      gameFrame = 0;
    }
    if (frameX >= 6) frameX = 0;
    ctx.drawImage(
      this.dogImage,

      frameX * this.dogFrame.dogWidth,
      frameY * this.dogFrame.dogHeight,
      this.dogFrame.dogWidth,
      this.dogFrame.dogHeight,
      this.position.x,
      this.position.y - 45,
      90,
      90
    );
    // if (gameFrame % this.dogFrame.dogFrame == 0) {
    //   if (frameX < 6) frameX++;
    //   else frameX = 0;
    // }
    // gameFrame++;
  };

  moveX = (player: Player, deltaTime: number) => {
    const movementSpeed = SPEED * (deltaTime / 16.67);
    if (keys["d"] && player.position.x >= 300) {
      this.position.x -= movementSpeed;
    } else if (keys["a"] && player.position.x >= 300) {
      this.position.x += movementSpeed;
    }
  };
  collidesPlayer(player: Player) {
    const currentTime = Date.now();
    if (detectCollision(player, this)) {
      if (
        scoreCount.health > 0 &&
        currentTime - this.lastHealthDecreaseTime > this.healthDecreaseCooldown
      ) {
        scoreCount.health -= 10;
        this.lastHealthDecreaseTime = currentTime; // Update the last decrease time
      }
    }
  }
  enemyBulletCollision = () => {
    objects.bullet.forEach((bull, index) => {
      if (detectCollision(bull, this)) {
        if (scoreCount.score > 0) scoreCount.health--;
        objects.bullet.splice(index, 1);
      }
    });
  };
}
