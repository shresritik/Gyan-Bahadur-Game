import { ctx } from "../components/canvas";
import { SPEED, keys } from "../constants/constants";
import { detectCollision } from "../utils/utils";
import { Base } from "./Base";
import { Player } from "./Player";
export class Plat extends Base {
  constructor(position: { x: number; y: number }, w: number, h: number) {
    super(position, h, w);
  }
  draw = (player: Player) => {
    const image = new Image();
    image.src = "images/wall.png";

    ctx.drawImage(image, this.position.x, this.position.y, this.w, this.h);
    if (detectCollision(player, this)) {
      if (this.position.y >= player.position.y) {
        player.position.y = this.position.y - player.h;
        player.velocityY = 0;
        if (keys["w"]) {
          player.velocityY -= 10;
        }
      } else if (player.position.y >= this.position.y) {
        player.velocityY = 0.4;
      } else {
        player.velocityY = -7;
      }

      // player.checkBoundaryY(this.position.y - player.h);
    }
  };
  moveX = (player: Player, deltaTime: number) => {
    const movementSpeed = (SPEED * deltaTime) / deltaTime;
    if (keys["d"] && player.position.x >= 300) this.position.x -= movementSpeed;
    else if (keys["a"] && player.position.x >= 300)
      this.position.x += movementSpeed;
  };
}
