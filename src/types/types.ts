import { Ammo } from "../classes/Ammo";
import { Animal } from "../classes/Animal";
import { Bullet } from "../classes/Bullet";
import { Enemy } from "../classes/Enemy";
import { Flag } from "../classes/Flag";
import { Fruit } from "../classes/Fruit";
import { Jetpack } from "../classes/Jetpack";
import { Plat } from "../classes/Platform";

export type Frame = {
  width: number;
  height: number;
  framex?: number;
};
export type Tquiz = {
  id: number;
  question: string;
  answerIndex: number;
  options: string[];
  error: string;
};
export type TObj = {
  platform: Plat[];
  enemy: Enemy[];
  fruit: Fruit[];
  flag: Flag[];
  animal: Animal[];
  ammo: Ammo[];
  bullet: Bullet[];
  enemyFireBullet: Bullet[];
  enemyBullet: Bullet[];
  jet: Jetpack[];
};
export type Ttile = number[][];

export type TButton = {
  x: number;
  y: number;
  w: number;
  h: number;
  option: number | null;
};
