import { ctx } from "../components/canvas";
import { SPEED } from "../constants/constants";
import { Base } from "./Base";
import firer from "../assets/firer.png";
import water from "../assets/water.png";
import corona from "../assets/corona.png";

let frameX = 0;
let frameY = 0;
const frameInterval = 1000 / 5; // 5 frames per second

let gameFrame = 0;

export class Bullet extends Base {
  velocity: { x: number };
  fireFrame: {
    fireWidth: number;
    fireHeight: number;
    fireFrame: number;
  } = {
    fireWidth: 254,
    fireHeight: 126,
    fireFrame: 20,
  };

  constructor(
    position: { x: number; y: number },
    h: number,
    w: number,
    direction: { x: number }
  ) {
    super(position, h, w);
    this.velocity = { x: direction.x }; // Example speed, adjust as needed
  }

  drawBullet(deltaTime: number, tile?: number) {
    const image = new Image();
    gameFrame += deltaTime;
    if (gameFrame >= frameInterval) {
      frameY++;
      gameFrame = 0;
    }

    if (tile === 4) {
      image.src = firer;
      if (frameY >= 6) frameY = 0;

      ctx.drawImage(
        image,
        frameX * this.fireFrame.fireWidth,
        frameY * this.fireFrame.fireHeight,
        this.fireFrame.fireWidth,
        this.fireFrame.fireHeight,
        this.position.x,
        this.position.y - 45,
        80,
        50
      );
    } else if (tile === 5) {
      image.src = corona;
      ctx.drawImage(image, this.position.x, this.position.y - 10, 32, 32);
    } else {
      image.src = water;
      if (frameY >= 6) frameY = 0;

      ctx.drawImage(
        image,
        frameX * this.fireFrame.fireWidth,
        frameY * this.fireFrame.fireHeight,
        this.fireFrame.fireWidth,
        this.fireFrame.fireHeight,
        this.position.x,
        this.position.y - 45,
        80,
        50
      );
    }
  }

  moveBullet(deltaTime: number) {
    this.position.x += this.velocity.x * ((SPEED * deltaTime) / 16.67);
  }
}
