import { ctx } from "../components/canvas";
import { keys } from "../constants/constants";
import { backgroundMovement, detectCollision } from "../utils/utils";
import { Base } from "./Base";
import { Player } from "./Player";
import wall from "../assets/wall.png";
export class Plat extends Base {
  #image: HTMLImageElement;

  constructor(position: { x: number; y: number }, w: number, h: number) {
    super(position, h, w);
    this.#image = new Image();
    this.#image.src = wall;
  }

  draw = () => {
    ctx.drawImage(
      this.#image,
      this.position.x,
      this.position.y,
      this.w,
      this.h
    );
  };
  // handle horizontal and vertical collision with the player
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
        if (keys["w"] || keys["ArrowUp"]) {
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
    backgroundMovement(player, this, deltaTime);
  };
}
