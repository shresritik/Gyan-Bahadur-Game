import { Player } from "../classes/Player";
import { toggleFullScreen } from "../components/toggleFullScreen";
import { CANVAS_WIDTH, SPEED, keys } from "../constants/constants";
import { TKeys } from "../interface/interface";
import { Tdetector } from "../types/types";
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
/**
 * handle fullscreen request with Alt+Enter
 */
export const handleFullScreen = () => {
  let keysPressed: TKeys = {};
  document.addEventListener(
    "keydown",
    (e) => {
      keysPressed[e.key] = true;
      if (keysPressed["Alt"] && e.key == "Enter") {
        toggleFullScreen();
      }
    },
    false
  );
  document.addEventListener("keyup", (event) => {
    delete keysPressed[event.key];
  });
};
/**
 *
 * @param x1 :number get initial x coordinate
 * @param y1 :number get initial y coordinate
 * @param x2 :number get final x coordinate
 * @param y2 :number get final y coordinate
 * @returns distance between them
 */
export function getDistance(
  x1: number = 0,
  y1: number = 0,
  x2: number = 0,
  y2: number = 0
): number {
  return Math.floor(Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2));
}
/**
 * if the caller is on canvas then only play the audio
 * @param audio audio media element
 * @param caller object
 */
export function audioOnCanvas(audio: HTMLMediaElement, caller: Tdetector) {
  if (caller.position.x <= CANVAS_WIDTH && caller.position.x >= 0) {
    audio.play();
  }
}
/**
 * move the background when player.position.x reaches 300 to create horizontal movement
 * @param player
 * @param caller
 * @param deltatime
 */
export function backgroundMovement(
  player: Player,
  caller: Tdetector,
  deltatime: number
) {
  const movementSpeed = (SPEED * deltatime) / 16.67;

  if ((keys["d"] || keys["ArrowRight"]) && player.position.x >= 300)
    caller.position.x -= movementSpeed;
  else if ((keys["a"] || keys["ArrowLeft"]) && player.position.x >= 300)
    caller.position.x += movementSpeed;
}
