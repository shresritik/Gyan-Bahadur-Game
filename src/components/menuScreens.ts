import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  GameState,
  gameState,
  gameStatus,
  levelGrade,
  menuOptions,
  scoreCount,
} from "../constants/constants";
import { ctx } from "./canvas";
const buttonBox = { x: 800, y: 50, w: 200, h: 500 };
const menuButtons = ["Start", "Editor", "Instruction"];

document.addEventListener("click", handleClick);
let optionButtons: any;
let homeButton: any; // Add this line to store the "Return to Home" button properties

function handleClick(e: MouseEvent) {
  const { offsetX, offsetY } = e;
  if (optionButtons) {
    for (const button of optionButtons) {
      if (
        offsetX >= button.x &&
        offsetY >= button.y &&
        offsetX <= button.x + button.w &&
        offsetY <= button.y + button.h
      ) {
        let selectedOption = button.option - 1;
        console.log(menuButtons[selectedOption]);
        menuOptions.option = menuButtons[selectedOption];

        gameStatus.isPaused = false;

        if (menuOptions.option == "Editor") {
          const table = document.querySelector(
            ".customLevel"
          ) as HTMLSelectElement;
          table.style.display = "block";
        }
      }
    }
  }

  // Add this block to handle clicks on the "Return to Home" button
  if (homeButton) {
    if (
      offsetX >= homeButton.x &&
      offsetY >= homeButton.y &&
      offsetX <= homeButton.x + homeButton.w &&
      offsetY <= homeButton.y + homeButton.h
    ) {
      drawStartScreen(); // Show the start screen
    }
  }
}

export function drawStartScreen() {
  gameState.currentState = GameState.Start;
  ctx.fillStyle = "#F7F0EA";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "red";
  ctx.font = "40px sans-serif";
  ctx.fillText("Game", CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2 - 80);
  ctx.font = "30px sans-serif";
  ctx.fillText("Press Space to Start", CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2);
  ctx.font = "22px sans-serif";
  ctx.fillText(
    "Move Left: a key. Move Right:d key",
    CANVAS_WIDTH / 5,
    CANVAS_HEIGHT / 2 + 40
  );
  ctx.fillText("Bullet: f key ", CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2 + 70);
  ctx.font = "22px sans-serif";
  ctx.fillText(
    "Pause/Resume: p key",
    CANVAS_WIDTH / 5,
    CANVAS_HEIGHT / 2 + 100
  );
  optionButtons = menuButtons.map((option, index) => {
    const button = {
      x: buttonBox.x + 20,
      y: buttonBox.y + 100 + index * 60,
      w: buttonBox.w - 40,
      h: 50,
      option: index + 1,
    };

    ctx.fillStyle = "red";
    ctx.fillRect(button.x, button.y, button.w, button.h);
    ctx.fillStyle = "white";
    ctx.fillText(option, button.x + 15, button.y + 31);

    return button;
  });
}

export function gameOverFunction() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "red";
  ctx.font = "40px sans-serif";
  if (levelGrade.success)
    ctx.fillText("You Win", CANVAS_WIDTH / 4 + 20, CANVAS_HEIGHT / 2 - 100);
  else ctx.fillText("You Lose", CANVAS_WIDTH / 4 + 20, CANVAS_HEIGHT / 2 - 100);

  ctx.fillText("Game Over", CANVAS_WIDTH / 4 + 20, CANVAS_HEIGHT / 2 - 50);
  let maxScore = localStorage.getItem("maxScore");
  ctx.font = "30px sans-serif";
  ctx.fillText(
    `High Score: ${maxScore}`,
    CANVAS_WIDTH / 4 + 30,
    CANVAS_HEIGHT / 2
  );
  ctx.fillText(
    `Your Score: ${scoreCount.score}`,
    CANVAS_WIDTH / 4 + 30,
    CANVAS_HEIGHT / 2 + 40
  );

  ctx.fillText(
    `Press P to restart`,
    CANVAS_WIDTH / 4 - 20,
    CANVAS_HEIGHT / 2 + 100
  );

  // Draw "Return to Home" button
  homeButton = {
    x: CANVAS_WIDTH / 4 - 20,
    y: CANVAS_HEIGHT / 2 + 150,
    w: 200,
    h: 50,
  };

  ctx.fillStyle = "blue";
  ctx.fillRect(homeButton.x, homeButton.y, homeButton.w, homeButton.h);
  ctx.fillStyle = "white";
  ctx.fillText("Return to Home", homeButton.x + 15, homeButton.y + 31);
}

export function drawPauseScreen() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "red";
  ctx.font = "30px sans-serif";
  ctx.fillText("Game Paused", CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2);
  ctx.fillText("Press P to Resume", CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2 + 50);
  ctx.fillText("Press L to Menu", CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2 + 90);

  // Draw "Return to Home" button
  homeButton = {
    x: CANVAS_WIDTH / 4,
    y: CANVAS_HEIGHT / 2 + 130,
    w: 200,
    h: 50,
  };

  ctx.fillStyle = "blue";
  ctx.fillRect(homeButton.x, homeButton.y, homeButton.w, homeButton.h);
  ctx.fillStyle = "white";
  ctx.fillText("Return to Home", homeButton.x + 15, homeButton.y + 31);
}
