import { ctx } from "../components/canvas";
import { SPEED, objects, scoreCount } from "../constants/constants";
import { detectCollision } from "../utils/utils";
import { Base } from "./Base";
import { Player } from "./Player";
import fruitImg from "../assets/food-drink-00.png";
export class Fruit extends Base {
  constructor(position: { x: number; y: number }, w: number, h: number) {
    super(position, h, w);
  }
  draw = (player: Player) => {
    const image = new Image();
    image.src = fruitImg;

    ctx.drawImage(
      image,
      0,
      0,
      67,
      73,
      this.position.x,
      this.position.y,
      this.w,
      this.h
    );
    if (detectCollision(player, this)) {
      scoreCount.score++;
      objects.fruit.shift();
      //   player.checkBoundaryY(this.position.y - player.h);
    }
  };
  moveX = (player: Player, deltaTime: number) => {
    const movementSpeed = (SPEED * deltaTime) / deltaTime;
    if (player.keys["d"] && player.position.x >= 300)
      this.position.x -= movementSpeed;
    else if (player.keys["a"] && player.position.x >= 300)
      this.position.x += movementSpeed;
  };
}
