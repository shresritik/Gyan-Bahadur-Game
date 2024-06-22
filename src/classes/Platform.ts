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
      // Vertical Collision: Player lands on top or hits the bottom of the platform
      if (
        player.position.y + player.h > this.position.y &&
        player.position.y + player.h <= this.position.y + this.h / 2
      ) {
        // Player lands on the platform
        player.position.y = this.position.y - player.h;
        player.velocityY = 0;
        if (keys["w"]) {
          player.velocityY = -8;
        }
      } else if (
        player.position.y < this.position.y + this.h &&
        player.position.y >= this.position.y + this.h / 2
      ) {
        // Player hits the bottom of the platform
        player.velocityY = 0.4;
      }

      // Horizontal Collision: Player collides from the left or right
      if (
        player.position.x < this.position.x + this.w &&
        player.position.x + player.w > this.position.x
      ) {
        if (
          player.position.x < this.position.x &&
          player.position.y + player.h > this.position.y
        ) {
          // Player collides with the left side of the platform
          player.position.x = this.position.x - player.w;
        } else if (
          player.position.x + player.w > this.position.x + this.w &&
          player.position.y + player.h > this.position.y
        ) {
          // Player collides with the right side of the platform
          player.position.x = this.position.x + this.w;
        }
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
