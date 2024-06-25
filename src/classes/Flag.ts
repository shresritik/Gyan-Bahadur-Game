import { ctx } from "../components/canvas";
import { gameStatus, quizMap } from "../constants/constants";
import {
  audioOnCanvas,
  backgroundMovement,
  detectCollision,
} from "../utils/utils";
import { Base } from "./Base";
import { Player } from "./Player";
import flagImg from "../assets/flag.png";
import { Quiz } from "./Quiz";
import { flagAudio } from "../components/audio";
import { Frame } from "../types/types";

let frameX = 0;
let gameFrame = 0;
const frameInterval = 1000 / 6;

export class Flag extends Base {
  quiz: Quiz | null;
  outQuiz: boolean;
  quizStartTime: number | null;
  answerProvidedTime: number | null;
  gameOverStartTime: number | null;
  #flagFrame: Frame = {
    width: 92,
    height: 100,
  };
  flagImage: HTMLImageElement;

  constructor(position: { x: number; y: number }, h: number, w: number) {
    super(position, h, w);
    this.quiz = null;
    this.outQuiz = false;
    this.quizStartTime = null;
    this.answerProvidedTime = null;
    this.gameOverStartTime = null;
    this.flagImage = new Image();
    this.flagImage.src = flagImg;
  }

  drawFlag(deltaTime: number) {
    audioOnCanvas(flagAudio, this);
    gameFrame += deltaTime;
    if (gameFrame >= frameInterval) {
      frameX++;
      gameFrame = 0;
    }
    if (frameX > 3) frameX = 0;
    ctx.drawImage(
      this.flagImage,
      frameX * this.#flagFrame.width,
      0,
      this.#flagFrame.width,
      this.#flagFrame.height,
      this.position.x,
      this.position.y - 80,
      100,
      130
    );
  }

  showQuiz(player: Player) {
    if (this.outQuiz) {
      if (!this.gameOverStartTime) {
        this.gameOverStartTime = Date.now();
      }
      const gameOverElapsed = Date.now() - this.gameOverStartTime;
      if (gameOverElapsed >= 1500) {
        gameStatus.gameOver = true;
        this.gameOverStartTime = null;
      }
      return;
    }

    if (detectCollision(player, this)) {
      if (!gameStatus.isQuiz && !this.outQuiz) {
        gameStatus.isQuiz = true;
        this.gameOverStartTime = null;
      }

      if (gameStatus.isQuiz && quizMap.quizMap != null) {
        if (quizMap.quizMap.correct !== null) {
          if (!this.answerProvidedTime) {
            this.answerProvidedTime = Date.now();
          }
          const answerElapsed = Date.now() - this.answerProvidedTime;
          if (answerElapsed >= 3000) {
            this.answerProvidedTime = null;
            this.outQuiz = true;
            quizMap.quizMap.closeQuiz();
          }
        }
      }
    }
  }

  moveX = (player: Player, deltaTime: number) => {
    backgroundMovement(player, this, deltaTime);
  };
}
