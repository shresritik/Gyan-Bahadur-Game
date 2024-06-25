import { level1, level2, levelGrade, objects } from "../constants/constants";
import { Ammo } from "./Ammo";
import { Animal } from "./Animal";
import { Enemy } from "./Enemy";
import { Flag } from "./Flag";
import { Fruit } from "./Fruit";
import { Plat } from "./Platform";
import { Player } from "./Player";
import { Jetpack } from "./Jetpack";
import { backgroundMovement, getRandomValue } from "../utils/utils";
import { Ttile } from "../types/types";

export class TileMap {
  #tileSize: number = 32;
  map: Ttile = [];
  constructor(level: number) {
    levelGrade.level = level;
    if (levelGrade.level == -1) {
      this.map = localStorage.getItem("map")
        ? JSON.parse(localStorage.getItem("map")!)
        : "";
    } else if (levelGrade.level == 1) {
      this.map = level1;
    } else if (levelGrade.level == 2) {
      this.map = level2;
    }
    levelGrade.success = "";
  }
  //initialize the objects
  drawMap = (player: Player) => {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column];
        if (tile == 1) {
          objects.platform.push(
            new Plat(
              { x: column * this.#tileSize, y: row * this.#tileSize },
              this.#tileSize,
              this.#tileSize
            )
          );
        } else if (tile == 4 || tile == 5) {
          const newEnemy = new Enemy(
            {
              x: column * this.#tileSize,
              y:
                tile == 4
                  ? row * this.#tileSize - 60
                  : row * this.#tileSize - 70,
            },
            80,
            100,
            tile
          );

          newEnemy.startShooting(player);
          objects.enemy.push(newEnemy);
        } else if (tile == 2) {
          let val = getRandomValue(2, 4);

          objects.fruit.push(
            new Fruit(
              { x: column * this.#tileSize, y: row * this.#tileSize },
              this.#tileSize,
              this.#tileSize,
              val
            )
          );
        } else if (tile == 6) {
          objects.flag.push(
            new Flag(
              { x: column * this.#tileSize, y: row * this.#tileSize },
              this.#tileSize,
              this.#tileSize
            )
          );
        } else if (tile == 7) {
          objects.animal.push(
            new Animal(
              { x: column * this.#tileSize, y: row * this.#tileSize - 70 },
              100,
              120,
              tile
            )
          );
        } else if (tile == 8) {
          objects.ammo.push(
            new Ammo(
              { x: column * this.#tileSize, y: row * this.#tileSize },
              this.#tileSize,
              this.#tileSize
            )
          );
        } else if (tile == 9) {
          objects.jet.push(
            new Jetpack(
              { x: column * this.#tileSize, y: row * this.#tileSize },
              this.#tileSize,
              this.#tileSize
            )
          );
        }
      }
    }
  };
  // move all the objects
  moveX = (player: Player, deltaTime: number) => {
    objects.platform.forEach((pl) => {
      pl.moveX(player, deltaTime);
      pl.draw();
      pl.playerCollision(player);
      objects.enemy.forEach((en) => {
        en.platformCollision(pl);
      });
    });
    objects.bullet.forEach((bul) => {
      backgroundMovement(player, bul, deltaTime);
    });
    objects.enemyBullet.forEach((bul) => {
      backgroundMovement(player, bul, deltaTime);
    });
  };
  drawEnemy(player: Player, deltaTime: number) {
    objects.enemy.forEach((en) => {
      en.draw();
      en.updateEnemyBullet(player, deltaTime);
      en.playerCollision(player);
      en.enemyBulletCollision();
      en.moveX(player, deltaTime);
      en.audioEnemy();
      en.updateEnemyBullet(player, deltaTime);
      en.enemyBulletCollision();
      objects.platform.forEach((platform) => {
        en.platformCollision(platform);
      });
    });
  }
  drawFruit(player: Player, deltaTime: number) {
    objects.fruit.forEach((fr) => {
      fr.draw(player);
      fr.moveX(player, deltaTime);
    });
  }
  drawFlag(player: Player, deltaTime: number) {
    objects.flag.forEach((fl) => {
      fl.drawFlag(deltaTime);
      fl.moveX(player, deltaTime);
      fl.showQuiz(player);
    });
  }
  drawAnimal(player: Player, deltaTime: number) {
    objects.animal.forEach((an) => {
      an.drawAnimal(deltaTime);
      an.moveX(player, deltaTime);
      an.collidesPlayer(player);
      an.enemyBulletCollision();
    });
  }
  drawAmmo(player: Player, deltaTime: number) {
    objects.ammo.forEach((am) => {
      am.drawAmmo(deltaTime);
      am.moveX(player, deltaTime);

      am.collidesPlayer(player);
    });
  }
  drawJet(player: Player, deltaTime: number) {
    objects.jet.forEach((am) => {
      am.drawJet(deltaTime);

      am.collidesPlayer(player, deltaTime);
      am.moveX(player, deltaTime);
    });
  }
}
