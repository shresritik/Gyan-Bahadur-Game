import { Bullet } from "../classes/Bullet";
import { Plat } from "../classes/Platform";
import { Player } from "../classes/Player";
import { Quiz } from "../classes/Quiz";
import { Ttile } from "../types/types";

export interface IBase {
  position: { x: number; y: number };
  h: number;
  w: number;
  bulletY?: number;
}
export interface TKeys {
  [keys: string]: boolean;
}
export interface MapObject {
  map: number[][];
}
export interface IBullet {
  angle: number;
  drawBullet(deltaTime: number, tile?: number): void;
  moveBullet(deltaTime: number): void;
}
export interface IAmmo {
  drawAmmo(deltaTime: number): void;
  collidesPlayer(player: Player): void;
  moveX(player: Player, deltaTime: number): void;
}

export interface IAnimal {
  lastHealthDecreaseTime: number;
  healthDecreaseCooldown: number;
  drawAnimal(deltaTime: number): void;
  moveX(player: Player, deltaTime: number): void;
  enemyBulletCollision(): void;
  collidesPlayer(player: Player): void;
}
export interface IFlag {
  quiz: Quiz | null;
  outQuiz: boolean;
  quizStartTime: number | null;
  answerProvidedTime: number | null;
  gameOverStartTime: number | null;
}
export interface IFruit {
  draw(player: Player): void;
  moveX(player: Player, deltaTime: number): void;
}
export interface IJetpack {
  drawJet(deltaTime: number): void;
  collidesPlayer(player: Player, deltaTime: number): void;
  moveX(player: Player, deltaTime: number): void;
}
export interface IPlat {
  draw(): void;
  moveX(player: Player, deltaTime: number): void;
  playerCollision(player: Player): void;
}
export interface IPlayer {
  velocityY: number;
  gravity: number;
  jetpackPickupTime: number | null;
  directionRight: boolean;
  draw(deltaTime: number): void;
  moveX(deltaTime: number): void;
  moveY(deltaTime: number): void;
  fireBullet(angleVal: number): void;
  updateBullet(deltaTime: number): void;
}
export interface IQuiz {
  correct: boolean | null;
  selectedOption: number | null;
  draw(): void;
  handleKeyPress(e: KeyboardEvent): void;
  handleClick(e: MouseEvent): void;
  closeQuiz(): void;
}

export interface ITile {
  map: Ttile;
  drawMap(player: Player): void;
  moveX(player: Player, deltaTime: number): void;
  drawEnemy(player: Player, deltaTime: number): void;
  drawFruit(player: Player, deltaTime: number): void;
  drawFlag(player: Player, deltaTime: number): void;
  drawAmmo(player: Player, deltaTime: number): void;
  drawJet(player: Player, deltaTime: number): void;
  drawAnimal(player: Player, deltaTime: number): void;
}
export interface IEnemy {
  tile: number;
  enemyBullet: Bullet[];
  bulletInterval: number | undefined;
  lastHealthDecreaseTime: number;
  healthDecreaseCooldown: number;

  startShooting(player: Player): void;
  draw(): void;
  audioEnemy(): void;
  createBullet(player: Player): void;
  updateEnemyBullet(player: Player, deltatime: number): void;
  playerCollision(player: Player): void;
  platformCollision(platform: Plat): void;
  enemyBulletCollision(): void;
  moveX(player: Player, deltaTime: number): void;
  destroy(): void;
}
