import {
  ammoObj,
  gameStatus,
  levelGrade,
  scoreCount,
} from "../constants/constants";
import { ctx } from "./canvas";

export const writeScore = () => {
  let maxScore: number = 0;

  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  if (maxScore < scoreCount.score) {
    maxScore = scoreCount.score;
    localStorage.setItem("maxScore", JSON.stringify(maxScore));
  }
  ctx.fillText(`Score: ${scoreCount.score}`, 15, 35);
};

export const writeBullet = (image: HTMLImageElement) => {
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.drawImage(image, 110, 10, 20, 30);
  ctx.fillText(`${ammoObj.ammo}`, 140, 35);
};

export const writeLevel = () => {
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText(`Level: ${levelGrade.level}`, 170, 35);
};

export const drawHealthBar = (
  x = 15,
  y = 50,
  width = 200,
  height = 20,
  maxHealth: number = 100
) => {
  let currentHealth = scoreCount.health;
  if (currentHealth <= 0) {
    gameStatus.gameOver = true;
  }

  ctx.fillStyle = "#000";
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "white";
  ctx.fillText(` ${currentHealth}%`, 215, 68);

  const healthWidth = (currentHealth / maxHealth) * width;
  ctx.fillStyle = "green";
  ctx.fillRect(x, y, healthWidth, height);

  ctx.strokeStyle = "#fff";
  ctx.strokeRect(x, y, width, height);
};
