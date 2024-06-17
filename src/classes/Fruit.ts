import { ctx } from "../components/canvas";
import { SPEED, keys, objects, scoreCount } from "../constants/constants";
import { detectCollision } from "../utils/utils";
import { Base } from "./Base";
import { Player } from "./Player";
import banana from "../assets/banana.png";
import grape from "../assets/grapes.png";

export class Fruit extends Base {
  tile: number = 0;

  constructor(
    position: { x: number; y: number },
    w: number,
    h: number,
    tile: number
  ) {
    super(position, h, w);
    this.tile = tile;
  }

  draw = (player: Player) => {
    const image = new Image();

    if (this.tile === 3) {
      image.src = banana;
    } else if (this.tile === 2) {
      image.src = grape;
    }

    if (image.src) {
      ctx.drawImage(image, this.position.x, this.position.y, this.w, this.h);

      if (detectCollision(player, this)) {
        scoreCount.score++;
        objects.fruit = objects.fruit.filter((fruit) => fruit !== this); // Remove the specific fruit
      }
    }
  };

  moveX = (player: Player, deltaTime: number) => {
    const movementSpeed = (SPEED * deltaTime) / deltaTime;
    if (keys["d"] && player.position.x >= 300) {
      this.position.x -= movementSpeed;
    } else if (keys["a"] && player.position.x >= 300) {
      this.position.x += movementSpeed;
    }
  };
}
