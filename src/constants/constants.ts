import { Ammo } from "../classes/Ammo";
import { Animal } from "../classes/Animal";
import { Bullet } from "../classes/Bullet";
import { Enemy } from "../classes/Enemy";
import { Flag } from "../classes/Flag";
import { Fruit } from "../classes/Fruit";
import { Plat } from "../classes/Platform";
import { Powerup } from "../classes/Jetpack";
import { Quiz } from "../classes/Quiz";
export interface TKeys {
  [keys: string]: boolean;
}
export const keys: TKeys = {};
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 640;
export const SPEED = 2;
export const COLOR = "#F7F0EA";
export enum GameState {
  Start,
  Playing,
  GameOver,
}
export const gameState = {
  currentState: GameState.Start,
};
export const gameStatus = { gameOver: false, isPaused: false, isQuiz: false };
export const scoreCount = { score: 0, health: 100 };
export const quizMap: { quizMap: Quiz | null } = { quizMap: null };
export const objects: {
  platform: Plat[];
  enemy: Enemy[];
  fruit: Fruit[];
  flag: Flag[];
  animal: Animal[];
  ammo: Ammo[];
  bullet: Bullet[];
  enemyFireBullet: Bullet[];
  enemyBullet: Bullet[];
  jet: Powerup[];
} = {
  platform: [],
  enemy: [],
  fruit: [],
  flag: [],
  animal: [],
  ammo: [],
  bullet: [],
  enemyFireBullet: [],
  enemyBullet: [],
  jet: [],
};
export const ammoObj = {
  ammo: 5,
};
export const quizObj = [
  {
    id: 0,
    question: "Who is PM of Nepal in 2081 B.S",
    answerIndex: 1,
    options: ["Prachanda", "Man Bahadur", "K.P Oli"],
    error: "Prachanda became PM in 2079 B.S",
  },
  {
    id: 1,
    question: "Who is CM of Nepal in 2081 B.S",
    answerIndex: 1,
    options: ["Empty", "Sher Bahadur Deuba", "K.P Oli"],
    error: "Empty became PM in 2079 B.S",
  },
];
export const levelGrade = { success: "", customLevel: false };
export const menuOptions = { option: "", start: false };
export const isCustom = { custom: false };
export const audioLevel = { isMuted: false };
