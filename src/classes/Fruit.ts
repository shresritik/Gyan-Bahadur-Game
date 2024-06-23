import { ctx } from "../components/canvas";
import { objects, scoreCount } from "../constants/constants";
import { backgroundMovement, detectCollision } from "../utils/utils";
import { Base } from "./Base";
import { Player } from "./Player";
import banana from "../assets/banana.png";
import grape from "../assets/grapes.png";
import { eatingAudio } from "../components/audio";

export class Fruit extends Base {
  tile: number = 0;
  private static bananaImage: HTMLImageElement;
  private static grapeImage: HTMLImageElement;

  constructor(
    position: { x: number; y: number },
    w: number,
    h: number,
    tile: number
  ) {
    super(position, h, w);
    this.tile = tile;

    if (!Fruit.bananaImage) {
      Fruit.bananaImage = new Image();
      Fruit.bananaImage.src = banana;
    }

    if (!Fruit.grapeImage) {
      Fruit.grapeImage = new Image();
      Fruit.grapeImage.src = grape;
    }
  }

  draw = (player: Player) => {
    let image: HTMLImageElement | undefined;

    if (this.tile === 3) {
      image = Fruit.bananaImage;
    } else if (this.tile === 2) {
      image = Fruit.grapeImage;
    }

    if (image && image.complete) {
      ctx.drawImage(image, this.position.x, this.position.y - 10, 40, 50);

      if (detectCollision(player, this)) {
        eatingAudio.play();
        if (scoreCount.health < 100) scoreCount.health++;
        objects.fruit = objects.fruit.filter((fruit) => fruit !== this); // Remove the specific fruit
      }
    } else if (image) {
      image.onload = () => {
        ctx.drawImage(image, this.position.x, this.position.y - 10, 40, 50);

        if (detectCollision(player, this)) {
          eatingAudio.play();

          if (scoreCount.health < 100) scoreCount.health++;
          objects.fruit = objects.fruit.filter((fruit) => fruit !== this); // Remove the specific fruit
        }
      };
    }
  };

  moveX = (player: Player, deltaTime: number) => {
    // const movementSpeed = (SPEED * deltaTime) / 16.67;
    // if (keys["d"] && player.position.x >= 300) {
    //   this.position.x -= movementSpeed;
    // } else if (keys["a"] && player.position.x >= 300) {
    //   this.position.x += movementSpeed;
    // }
    backgroundMovement(player, this, deltaTime);
  };
}
