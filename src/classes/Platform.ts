import { ctx } from "../components/canvas";
import { SPEED, keys } from "../constants/constants";
import { detectCollision } from "../utils/utils";
import { Base } from "./Base";
import { Enemy } from "./Enemy";
import { Player } from "./Player";

export class Plat extends Base {
  private image: HTMLImageElement;

  constructor(position: { x: number; y: number }, w: number, h: number) {
    super(position, h, w);
    this.image = new Image();
    this.image.src = "images/wall.png";
  }

  draw = (player: Player) => {
    if (this.image.complete) {
      ctx.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.w,
        this.h
      );
    } else {
      this.image.onload = () => {
        ctx.drawImage(
          this.image,
          this.position.x,
          this.position.y,
          this.w,
          this.h
        );
      };
    }
  };
  playerCollision(player: Player) {
    if (detectCollision(player, this)) {
      if (
        Math.abs(this.position.x - (player.position.x + player.w)) < 6 &&
        this.position.y < player.position.y + player.h
      ) {
        player.position.x = this.position.x - player.w;
      }
      console.log(
        player.position.x,
        this.position.x + this.w,
        this.position.y,
        player.position.y
      );
      if (
        Math.abs(player.position.x - (this.position.x + this.w)) < 30 &&
        player.position.y > this.position.y &&
        !player.directionRight
      ) {
        player.position.x = this.position.x + this.w;
      }
      if (
        this.position.y >= player.position.y &&
        player.position.x + player.w > this.position.x
      ) {
        // if player lands on platform keep it on top of it
        player.position.y = this.position.y - player.h;
        player.velocityY = 0;
        if (keys["w"]) {
          player.velocityY = -8;
        }
      }
      //if player is below the platform don't let it jump above it
      else if (player.position.y >= this.position.y) {
        player.velocityY = 0.4;
      }
    }
  }

  moveX = (player: Player, deltaTime: number) => {
    const movementSpeed = (SPEED * deltaTime) / 16.67; // Corrected deltaTime application
    if (keys["d"] && player.position.x >= 300) {
      this.position.x -= movementSpeed;
    } else if (keys["a"] && player.position.x >= 300) {
      this.position.x += movementSpeed;
    }
  };
}
