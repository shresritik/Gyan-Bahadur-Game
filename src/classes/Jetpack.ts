import { ctx } from "../components/canvas";
import { SPEED, objects } from "../constants/constants";
import { Base } from "./Base";
import jet from "../assets/jetpack2.png";
import { Player } from "./Player";
import { backgroundMovement, detectCollision } from "../utils/utils";
import { Frame } from "../types/types";
import { IJetpack } from "../interface/interface";

let frameX = 0;
let frameY = 0;
const frameInterval = 1000 / 5;
let gameFrame = 0;

export class Jetpack extends Base implements IJetpack {
  private jetImg: HTMLImageElement;
  private jetFrame: Frame = {
    width: 508,
    height: 523,
  };

  constructor(position: { x: number; y: number }, h: number, w: number) {
    super(position, h, w);
    this.jetImg = new Image();
    this.jetImg.src = jet;
  }

  drawJet(deltaTime: number) {
    if (frameX >= 3) frameX = 0;
    gameFrame += deltaTime;
    if (gameFrame >= frameInterval) {
      frameX++;
      gameFrame = 0;
    }
    ctx.drawImage(
      this.jetImg,
      frameX * this.jetFrame.width,
      frameY * this.jetFrame.height,
      this.jetFrame.width,
      this.jetFrame.height,
      this.position.x,
      this.position.y,
      50,
      60
    );
  }
  // if player collides the jetpack initialize the jetpack timer in player class
  collidesPlayer(player: Player, deltaTime: number) {
    const movementSpeed = (SPEED * deltaTime) / 16.67;
    if (detectCollision(player, this)) {
      player.velocityY = 0;
      player.velocityY -= movementSpeed;
      player.gravity = 0;
      player.jetpackPickupTime = Date.now();
      objects.jet = objects.jet.filter((j) => j != this);
    }
  }

  moveX(player: Player, deltaTime: number) {
    backgroundMovement(player, this, deltaTime);
  }
}
