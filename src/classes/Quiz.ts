import { ctx } from "../components/canvas";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  gameStatus,
  quizObj,
  scoreCount,
} from "../constants/constants";
import { getRandomValue } from "../utils/utils";

export class Quiz {
  correct: boolean | null = null;
  private quizBox = { x: 250, y: 50, w: 800, h: 500 };
  private randomIndex = getRandomValue(0, quizObj.length);
  private selectedOption: number | null = null;

  constructor() {
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  draw() {
    if (!gameStatus.isQuiz) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "blue";
    ctx.fillRect(
      this.quizBox.x,
      this.quizBox.y,
      this.quizBox.w,
      this.quizBox.h
    );
    ctx.fillStyle = "white";
    const currentQuiz = quizObj[this.randomIndex];

    ctx.fillText(
      currentQuiz.question,
      this.quizBox.x + 20,
      this.quizBox.y + 100,
      400
    );
    currentQuiz.options.forEach((option, index) => {
      ctx.fillText(
        index + 1 + ". " + option,
        this.quizBox.x + 20,
        this.quizBox.y * (index + 1) + 200,
        400
      );
    });

    if (this.correct !== null) {
      ctx.fillText(
        currentQuiz.error,
        this.quizBox.x + 20,
        this.quizBox.y + this.quizBox.h - 100,
        400
      );
      if (this.correct) {
        ctx.fillText(
          "Correct",
          this.quizBox.x + 20,
          this.quizBox.y + this.quizBox.h - 140,
          400
        );
      } else if (this.correct === false) {
        ctx.fillText(
          "Incorrect",
          this.quizBox.x + 20,
          this.quizBox.y + this.quizBox.h - 140,
          400
        );
      }
    }

    document.addEventListener("keypress", this.handleKeyPress);
  }

  handleKeyPress(e: KeyboardEvent) {
    const currentQuiz = quizObj[this.randomIndex];

    if (!isNaN(Number(e.key))) {
      this.selectedOption = Number(e.key);
    }

    if (e.key === "Enter") {
      if (this.selectedOption !== null) {
        if (this.selectedOption === currentQuiz.answerIndex) {
          scoreCount.score += 10;
          this.correct = true;
        } else {
          this.correct = false;
        }

        // Hide the quiz
        gameStatus.isQuiz = false;

        // Move to the next question or end the quiz

        // Remove the event listener
        document.removeEventListener("keypress", this.handleKeyPress);

        // Redraw canvas to clear the quiz display
      }
    }
  }
}

// Initialize the quiz
