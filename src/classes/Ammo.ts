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

let frameX = 0;
let frameY = 0;
const frameInterval = 1000 / 5;
let gameFrame = 0;
export class Ammo extends Base {
  velocity: { x: number };
  bulletIndex: number;
  fireFrame: {
    fireWidth: number;
    fireHeight: number;
    fireFrame: number;
  } = {
    fireWidth: 126,
    fireHeight: 254,
    fireFrame: 40,
  };
  ammoImg: HTMLImageElement;
  constructor(
    position: { x: number; y: number },
    h: number,
    w: number,
    direction: { x: number }
  ) {
    super(position, h, w);
    this.velocity = { x: direction.x }; // Example speed, adjust as needed
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

      frameX * this.fireFrame.fireWidth,
      frameY * this.fireFrame.fireHeight,
      this.fireFrame.fireWidth,
      this.fireFrame.fireHeight,
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
    // const movementSpeed = (SPEED * deltaTime) / 16.67;

    // if ((keys["d"] || keys["ArrowRight"])&& player.position.x >= 300) this.position.x -= movementSpeed;
    // else if (keys["a"] && player.position.x >= 300)
    //   this.position.x += movementSpeed;
  }
}
