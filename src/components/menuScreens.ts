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

import foreImg from "../assets/images/foreground.png";
import { TButton } from "../types/types";
const buttonBox = { x: 800, y: 50, w: 200, h: 500 };
const menuButtons = ["Start", "Editor", "Instruction"];
const foreImage = new Image();
foreImage.src = foreImg;
document.addEventListener("click", handleClick);
let optionButtons: TButton[];
let homeButton: TButton; // Add this line to store the "Return to Home" button properties

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
        let selectedOption = button.option! - 1;
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

  if (homeButton) {
    if (
      offsetX >= homeButton.x &&
      offsetY >= homeButton.y &&
      offsetX <= homeButton.x + homeButton.w &&
      offsetY <= homeButton.y + homeButton.h
    ) {
      drawStartScreen();
      menuOptions.option = ""; // Show the start screen
    }
  }
}

export function drawStartScreen() {
  gameState.currentState = GameState.Start;

  ctx.drawImage(foreImage, 80, 100, foreImage.width, foreImage.height);

  ctx.fillStyle = "white";
  ctx.font = "80px Paytone One";
  ctx.fillText("Gyan Bahadur", CANVAS_WIDTH / 3 + 200, 270);

  ctx.font = "22px Paytone One";

  optionButtons = menuButtons.map((option, index) => {
    const button: TButton = {
      x: buttonBox.x + 20,
      y: buttonBox.y + 250 + index * 60,
      w: buttonBox.w,
      h: 50,
      option: index + 1,
    };

    ctx.fillStyle = "red";
    ctx.fillRect(button.x, button.y, button.w, button.h);
    ctx.fillStyle = "white";
    ctx.fillText(option, button.x + 47, button.y + 31);

    return button;
  });
}
export function drawAboutScreen() {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "white";
  ctx.font = "22px sans-serif";
  ctx.fillText(
    "Move Left: a/left key. Move Right:d/right key. Up: w/up key",
    CANVAS_WIDTH / 5,
    CANVAS_HEIGHT / 3 - 100
  );
  ctx.fillText(
    "Bullet: f key. Projectile: g key ",
    CANVAS_WIDTH / 5,
    CANVAS_HEIGHT / 3 - 70
  );
  ctx.fillText("Pause/Resume: p key", CANVAS_WIDTH / 5, CANVAS_HEIGHT / 3 - 40);
  ctx.fillText(
    "Mute/Unmute All Sound: m key. Mute/Unmute Bg music: n key",
    CANVAS_WIDTH / 5,
    CANVAS_HEIGHT / 3 - 10
  );
  ctx.fillText(
    "Full Screen: Alt + Enter key",
    CANVAS_WIDTH / 5,
    CANVAS_HEIGHT / 3 + 20
  );
  ctx.fillText(
    "Score is increased if the enemy (virus/fire) is defeated.",
    CANVAS_WIDTH / 5,
    (3 * CANVAS_HEIGHT) / 6
  );
  ctx.fillText(
    "Health is decreased if enemy hits the player.",
    CANVAS_WIDTH / 5,
    (3 * CANVAS_HEIGHT) / 6 + 30
  );
  ctx.fillText(
    "Health is decreased if the player hits/collides with the dog.",
    CANVAS_WIDTH / 5,
    (3 * CANVAS_HEIGHT) / 6 + 60
  );
  ctx.fillText(
    "Health is increased with the food.",
    CANVAS_WIDTH / 5,
    (3 * CANVAS_HEIGHT) / 6 + 90
  );
  ctx.fillText(
    "Goal is to reach a flag and answer the quiz to increase score.",
    CANVAS_WIDTH / 5,
    (3 * CANVAS_HEIGHT) / 6 + 120
  );
  homeButton = {
    x: CANVAS_WIDTH / 4 - 60,
    y: CANVAS_HEIGHT / 2 + 150,
    w: 200,
    h: 50,
    option: null,
  };
  ctx.font = "22px Paytone One";

  ctx.fillStyle = "red";
  ctx.fillRect(homeButton.x, homeButton.y, homeButton.w, homeButton.h);
  ctx.fillStyle = "white";
  ctx.fillText("Return to Menu", homeButton.x + 15, homeButton.y + 32);
}

export function gameOverFunction() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "red";
  ctx.font = "40px Paytone One";
  if (levelGrade.success == "success") {
    ctx.fillText("You Win", CANVAS_WIDTH / 4 + 20, CANVAS_HEIGHT / 2 - 100);
  } else {
    ctx.fillText("You Lose", CANVAS_WIDTH / 4 + 20, CANVAS_HEIGHT / 2 - 100);
  }

  ctx.fillText("Game Over", CANVAS_WIDTH / 4 + 20, CANVAS_HEIGHT / 2 - 50);
  let maxScore = localStorage.getItem("maxScore");
  ctx.font = "30px Paytone One ";
  ctx.fillText(
    `High Score: ${maxScore}`,
    CANVAS_WIDTH / 4 + 20,
    CANVAS_HEIGHT / 2
  );
  ctx.fillText(
    `Your Score: ${scoreCount.score}`,
    CANVAS_WIDTH / 4 + 20,
    CANVAS_HEIGHT / 2 + 40
  );
  if (
    levelGrade.success == "success" &&
    levelGrade.level != 2 &&
    menuOptions.option != "Play"
  ) {
    ctx.fillText(
      `Press Space to continue`,
      CANVAS_WIDTH / 4 + 20,
      CANVAS_HEIGHT / 2 + 100
    );
    menuOptions.option = "";
  }

  homeButton = {
    x: CANVAS_WIDTH / 4 + 20,
    y: CANVAS_HEIGHT / 2 + 150,
    w: 250,
    h: 50,
    option: null,
  };
  ctx.fillStyle = "red";
  ctx.fillRect(homeButton.x, homeButton.y, homeButton.w, homeButton.h);
  ctx.fillStyle = "white";
  ctx.fillText("Return to Menu", homeButton.x + 15, homeButton.y + 33);
}

export function drawPauseScreen() {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "white";
  ctx.font = "30px Paytone One ";
  ctx.fillText("Game Paused", CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2);
  ctx.fillText("Press P to Resume", CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2 + 50);

  homeButton = {
    x: CANVAS_WIDTH / 4,
    y: CANVAS_HEIGHT / 2 + 70,
    w: 200,
    h: 50,
    option: null,
  };
  ctx.font = "22px Paytone One ";

  ctx.fillStyle = "red";
  ctx.fillRect(homeButton.x, homeButton.y, homeButton.w, homeButton.h);
  ctx.fillStyle = "white";
  ctx.fillText("Return to Menu", homeButton.x + 15, homeButton.y + 31);
}
//TODO update projectile
