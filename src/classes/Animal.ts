import { Base } from "./Base";
import dog from "../assets/dogr2.png";
import { ctx } from "../components/canvas";
import { objects, scoreCount } from "../constants/constants";
import { Player } from "./Player";
import { backgroundMovement, detectCollision } from "../utils/utils";
import { barkAudio, sadAudio } from "../components/audio";
import { Frame } from "../types/types";
import { IAnimal } from "../interface/interface";

let frameX = 0;
let frameY = 0;
const frameInterval = 1000 / 3;
let gameFrame = 0;
export class Animal extends Base implements IAnimal {
  lastHealthDecreaseTime = 0; // Last time health was decreased
  healthDecreaseCooldown = 800; // Cooldown period in milliseconds
  tile: number = 0;
  private dogFrame: Frame = {
    width: 60,
    height: 64,
  };
  private dogImage: HTMLImageElement;
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

      frameX * this.dogFrame.width,
      frameY * this.dogFrame.height,
      this.dogFrame.width,
      this.dogFrame.height,
      this.position.x,
      this.position.y,
      this.w,
      this.h
    );
  };

  moveX = (player: Player, deltaTime: number) => {
    backgroundMovement(player, this, deltaTime);
  };
  //decrease the health of the player if it collides with player
  collidesPlayer(player: Player) {
    const currentTime = Date.now();
    if (detectCollision(player, this)) {
      barkAudio.play();

      if (
        scoreCount.health > 0 &&
        currentTime - this.lastHealthDecreaseTime > this.healthDecreaseCooldown
      ) {
        scoreCount.health -= 5;
        this.lastHealthDecreaseTime = currentTime; // Update the last decrease time
      }
    }
  }
  //decrease the health of the player if it player shoots it

  enemyBulletCollision = () => {
    objects.bullet.forEach((bull, index) => {
      if (detectCollision(bull, this)) {
        sadAudio.play();
        if (scoreCount.health > 0) scoreCount.health -= 5;
        objects.bullet.splice(index, 1);
      }
    });
  };
}
