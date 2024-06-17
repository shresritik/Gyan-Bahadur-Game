import { Enemy } from "../classes/Enemy";
import { Fruit } from "../classes/Fruit";
import { Plat } from "../classes/Plat";
export interface TKeys {
  [keys: string]: boolean;
}
export const keys: TKeys = {};
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 640;
export const SPEED = 2;
export const COLOR = "#F7F0EA";
export const gameStatus = { gameOver: false, isPaused: false };
export const scoreCount = { score: 0 };
export const objects: { platform: Plat[]; enemy: Enemy[]; fruit: Fruit[] } = {
  platform: [],
  enemy: [],
  fruit: [],
};
