import { ctx } from "../components/canvas";
import { ammoObj, objects } from "../constants/constants";
import { Base } from "./Base";
import water from "../assets/h-water.png";
import { Player } from "./Player";
import {
  audioOnCanvas,
  backgroundMovement,
  detectCollision,
} from "../utils/utils";
import { ammoAudio } from "../components/audio";
import { Frame } from "../types/types";
import { IAmmo } from "../interface/interface";

let frameX = 0;
let frameY = 0;
const frameInterval = 1000 / 5;
let gameFrame = 0;

export class Ammo extends Base implements IAmmo {
  private bulletIndex: number;
  private fireFrame: Frame = {
    width: 126,
    height: 254,
  };
  private ammoImg: HTMLImageElement;
  constructor(position: { x: number; y: number }, h: number, w: number) {
    super(position, h, w);
    this.bulletIndex = 0;
    this.ammoImg = new Image();
    this.ammoImg.src = water;
  }

  drawAmmo(deltaTime: number) {
    audioOnCanvas(ammoAudio, this);
    gameFrame += deltaTime;
    if (gameFrame >= frameInterval) {
      frameX++;
      gameFrame = 0;
    }
    if (frameX >= 6) frameX = 0;
    ctx.drawImage(
      this.ammoImg,

      frameX * this.fireFrame.width,
      frameY * this.fireFrame.height,
      this.fireFrame.width,
      this.fireFrame.height,
      this.position.x,
      this.position.y - 40,
      50,
      80
    );
  }
  collidesPlayer(player: Player) {
    if (detectCollision(player, this)) {
      if (this.bulletIndex < 1) {
        this.bulletIndex++;
        ammoObj.ammo += 5;
        objects.ammo = objects.ammo.filter((am) => am != this);
      }
    }
  }
  moveX(player: Player, deltaTime: number) {
    backgroundMovement(player, this, deltaTime);
  }
}
