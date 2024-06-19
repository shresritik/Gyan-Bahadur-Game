import { ctx } from "../components/canvas";
import { SPEED, gameStatus, keys } from "../constants/constants";
import { detectCollision } from "../utils/utils";
import { Base } from "./Base";
import { Player } from "./Player";
import flagImg from "../assets/flag.png";
import { Quiz } from "./Quiz";
import { quizMap } from "../main";
let frameX = 0;
let frameY = 0;
let gameIndex = 0;
let gameFrame = 0;
export class Flag extends Base {
  velocity: { x: number };
  outQuiz: boolean;
  flagFrame: {
    flagWidth: number;
    flagHeight: number;
    flagFrame: number;
  } = {
    flagWidth: 98,
    flagHeight: 93.54,
    flagFrame: 200,
  };

  constructor(
    position: { x: number; y: number },
    h: number,
    w: number,
    direction: { x: number }
  ) {
    super(position, h, w);
    this.velocity = { x: direction.x };
    window.removeEventListener("keydown", (e: KeyboardEvent) => {
      keys[e.key] = false;
    });
    window.removeEventListener("keyup", (e: KeyboardEvent) => {
      keys[e.key] = false;
    }); // Example speed, adjust as needed
    this.outQuiz = false;
  }

  drawFlag() {
    const image = new Image();
    image.src = flagImg;
    ctx.drawImage(
      image,

      frameX * this.flagFrame.flagWidth,
      frameY * this.flagFrame.flagHeight,
      this.flagFrame.flagWidth,
      this.flagFrame.flagHeight,
      this.position.x,
      this.position.y - 65,
      100,
      130
    );
    if (gameFrame % this.flagFrame.flagFrame == 0) {
      if (frameX < 1) frameX++;
      else frameX = 0;
    }
    gameFrame++;

    // ctx.fillRect(this.position.x, this.position.y, 32, 32);
  }

  showQuiz(player: Player) {
    if (detectCollision(player, this)) {
      if (!gameStatus.isQuiz && !this.outQuiz) {
        gameStatus.isQuiz = true;
      }

      if (quizMap.correct != null) {
        setTimeout(() => {
          gameStatus.isQuiz = false;
          quizMap.correct = null;
          this.outQuiz = true;
        }, 2000); // Adjust timeout as needed
      }
    }
  }
  moveX = (player: Player, deltaTime: number) => {
    const movementSpeed = (SPEED * deltaTime) / 16.67;
    if (keys["d"] && player.position.x >= 300) {
      this.position.x -= movementSpeed;
    } else if (keys["a"] && player.position.x >= 300) {
      this.position.x += movementSpeed;
    }
  };
}
