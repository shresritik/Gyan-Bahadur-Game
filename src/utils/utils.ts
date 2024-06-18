import { Bullet } from "../classes/Bullet";
import { Enemy } from "../classes/Enemy";
import { Fruit } from "../classes/Fruit";
import { Plat } from "../classes/Plat";
import { Player } from "../classes/Player";
/**
 * Generates a random integer value between min (inclusive) and max (exclusive).
 * @param min The minimum value (inclusive).
 * @param max The maximum value (exclusive).
 * @returns A random integer value between min and max.
 */
export function getRandomValue(min: number, max: number): number {
  const maxValue = Math.ceil(max);
  const minValue = Math.floor(min);
  const value = Math.floor(Math.random() * (maxValue - minValue) + minValue);
  return value;
}
/**
 * Checks if a player's bullet collides with an enemy.
 * @param player The player's bullet.
 * @param other The enemy to check collision against.
 * @returns True if there is a collision, false otherwise.
 */
type Tdetector = Player | Plat | Bullet | Enemy | Fruit;

// export function detectCollision(
//   entity1: Tdetector,
//   entity2: Tdetector
// ): boolean {
//   return (
//     entity1.position.x <= entity2.position.x + entity2.w &&
//     entity1.position.x + entity1.w >= entity2.position.x &&
//     entity1.position.y + entity1.h <= entity2.position.y + entity2.h &&
//     entity1.position.y + entity1.h > entity2.position.y
//   );
// }
export function detectCollision(
  entity1: Tdetector,
  entity2: Tdetector
): boolean {
  return (
    entity1.position.x < entity2.position.x + entity2.w &&
    entity1.position.x + entity1.w > entity2.position.x &&
    entity1.position.y < entity2.position.y + entity2.h &&
    entity1.position.y + entity1.h > entity2.position.y
  );
}

export function getDistance(
  x1: number = 0,
  y1: number = 0,
  x2: number = 0,
  y2: number = 0
): number {
  return Math.floor(Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2));
}
export const normalizeVector = (vector: { x: number; y: number }) => {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  return {
    x: vector.x / length,
    y: vector.y / length,
  };
};

// export const normalizeVector = (vector: { x: number; y: number }) => {
//   const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
//   return { x: vector.x / length, y: vector.y / length };
// };
