import { ctx } from "../components/canvas";
import { SPEED, keys, objects } from "../constants/constants";
import { Base } from "./Base";
import jet from "../assets/jetpack.png";
import { Player } from "./Player";
import { detectCollision } from "../utils/utils";

export class Jetpack extends Base {
  jetImg: HTMLImageElement;

  constructor(position: { x: number; y: number }, h: number, w: number) {
    super(position, h, w);
    this.jetImg = new Image();
    this.jetImg.src = jet;
  }

  drawJet() {
    ctx.drawImage(
      this.jetImg,

      this.position.x,
      this.position.y - 40,
      50,
      60
    );
  }
  collidesPlayer(player: Player, deltaTime: number) {
    const movementSpeed = (SPEED * deltaTime) / 16.67;
    if (detectCollision(player, this)) {
      player.velocityY -= movementSpeed;
      player.gravity = 0;
      player.jetpackPickupTime = Date.now(); // Set the pickup time
      objects.jet = objects.jet.filter((j) => j != this);
    }
  }

  moveX(player: Player, deltaTime: number) {
    const movementSpeed = (SPEED * deltaTime) / 16.67;

    if (keys["d"] && player.position.x >= 300) this.position.x -= movementSpeed;
    else if (keys["a"] && player.position.x >= 300)
      this.position.x += movementSpeed;
  }
}
