import { ctx } from "../components/canvas";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  gameStatus,
  levelGrade,
  quizObj,
  scoreCount,
} from "../constants/constants";
import { IQuiz } from "../interface/interface";
import { TButton, Tquiz } from "../types/types";
import { getRandomValue } from "../utils/utils";

export class Quiz implements IQuiz {
  correct: boolean | null = null;
  private randomIndex: number = getRandomValue(0, quizObj.length);
  private quizBox = { x: 250, y: 50, w: 800, h: 500 };
  selectedOption: number | null = null;
  private optionButtons: TButton[] = [];

  constructor() {
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  private drawButtons(currentQuiz: Tquiz) {
    this.optionButtons = currentQuiz.options.map((option, index) => {
      const button = {
        x: this.quizBox.x + 20,
        y: this.quizBox.y + 100 + index * 60,
        w: this.quizBox.w - 40,
        h: 50,
        option: index + 1,
      };

      ctx.strokeStyle = "white";
      ctx.strokeRect(button.x, button.y, button.w, button.h);
      ctx.fillStyle = "white";
      ctx.fillText(button.option + ". " + option, button.x + 10, button.y + 30);

      return button;
    });
  }
  draw() {
    if (!gameStatus.isQuiz) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#0079C4";
    ctx.fillRect(
      this.quizBox.x,
      this.quizBox.y,
      this.quizBox.w,
      this.quizBox.h
    );
    ctx.fillStyle = "white";
    const currentQuiz = quizObj[this.randomIndex];
    ctx.font = "italic 20px sans-serif";
    ctx.fillText(
      "Note: Click on the options/Press the option number and press Enter",
      this.quizBox.x + 20,
      this.quizBox.y + 50
    );
    ctx.font = "normal 20px sans-serif";
    ctx.fillText(
      currentQuiz.question,
      this.quizBox.x + 20,
      this.quizBox.y + 80
    );

    this.drawButtons(currentQuiz);
    if (this.correct !== null) {
      ctx.fillText(
        currentQuiz.error,
        this.quizBox.x + 20,
        this.quizBox.y + this.quizBox.h - 100
      );
      if (this.correct) {
        ctx.fillText(
          "Correct",
          this.quizBox.x + 20,
          this.quizBox.y + this.quizBox.h - 140
        );
      } else if (this.correct === false) {
        ctx.fillText(
          "Incorrect",
          this.quizBox.x + 20,
          this.quizBox.y + this.quizBox.h - 140
        );
      }
    }

    document.addEventListener("keypress", this.handleKeyPress);
    document.addEventListener("click", this.handleClick);
  }

  handleKeyPress(e: KeyboardEvent) {
    if (!gameStatus.isQuiz) return;

    const currentQuiz = quizObj[this.randomIndex];

    if (!isNaN(Number(e.key))) {
      this.selectedOption = Number(e.key);
    }

    if (e.key === "Enter" && this.selectedOption !== null) {
      this.checkAnswer(this.selectedOption, currentQuiz);
    }
  }

  handleClick(e: MouseEvent) {
    if (!gameStatus.isQuiz) return;

    const { offsetX, offsetY } = e;

    for (const button of this.optionButtons) {
      if (
        offsetX >= button.x &&
        offsetY >= button.y &&
        offsetX <= button.x + button.w &&
        offsetY <= button.y + button.h
      ) {
        this.selectedOption = button.option;
        const currentQuiz = quizObj[this.randomIndex];
        this.checkAnswer(this.selectedOption!, currentQuiz);
        break;
      }
    }
  }

  private checkAnswer(option: number, currentQuiz: Tquiz) {
    if (option === currentQuiz.answerIndex) {
      scoreCount.score += 10;
      this.correct = true;
      levelGrade.success = "success";
    } else {
      this.correct = false;
      levelGrade.success = "fail";
    }
  }

  closeQuiz() {
    this.reset();
    document.removeEventListener("keypress", this.handleKeyPress);
    document.removeEventListener("click", this.handleClick);
    gameStatus.isQuiz = false;
  }

  private reset() {
    this.randomIndex = getRandomValue(0, quizObj.length);
    this.selectedOption = null;
  }
}
