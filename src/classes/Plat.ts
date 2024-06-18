import { ctx } from "../components/canvas";
import { SPEED, keys } from "../constants/constants";
import { detectCollision } from "../utils/utils";
import { Base } from "./Base";
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

    if (detectCollision(player, this)) {
      if (this.position.y >= player.position.y) {
        player.position.y = this.position.y - player.h;
        player.velocityY = 0;
        if (keys["w"]) {
          player.velocityY = -12;
        }
      } else if (player.position.y >= this.position.y) {
        player.velocityY = 0.4;
      }
    }
  };

  moveX = (player: Player, deltaTime: number) => {
    const movementSpeed = (SPEED * deltaTime) / 16.67; // Corrected deltaTime application
    if (keys["d"] && player.position.x >= 300) {
      this.position.x -= movementSpeed;
    } else if (keys["a"] && player.position.x >= 300) {
      this.position.x += movementSpeed;
    }
  };
}
