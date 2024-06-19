import { ctx } from "../components/canvas";
import { SPEED } from "../constants/constants";
import { Base } from "./Base";
import firer from "../assets/firer.png";
import corona from "../assets/corona.png";
let frameX = 0;
let frameY = 0;

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

  drawBullet(tile?: number) {
    const image = new Image();
    if (tile == 4) {
      image.src = firer;
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
      if (gameFrame % this.fireFrame.fireFrame == 0) {
        if (frameY < 6) frameY++;
        else frameY = 0;
      }
      gameFrame++;
    } else if (tile == 5) {
      image.src = corona;
      ctx.drawImage(
        image,

        this.position.x,
        this.position.y - 10,
        32,
        32
      );
    } else {
      ctx.beginPath();
      ctx.arc(
        this.position.x,
        this.position.y - 20,
        this.w / 2,
        0,
        2 * Math.PI,
        true
      );
      ctx.fill();
    }
  }

  moveBullet() {
    this.position.x += this.velocity.x * SPEED;
  }
}
