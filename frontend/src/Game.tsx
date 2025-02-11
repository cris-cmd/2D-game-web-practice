import { useEffect } from "react";
import Phaser from "phaser";
import front_face_walk from "./assets/animations/front_face_walk.png";
import side_face_walk from "./assets/animations/side_face_walk.png";
import back_face_walk from "./assets/animations/back_face_walk.png";
import front_face_idle from "./assets/animations/front_face_idle.png";
import side_face_idle from "./assets/animations/side_face_idle.png";
import back_face_idle from "./assets/animations/back_face_idle.png";
import farm_land_tile from "./assets/tile/farm_land_tile.png";
import grass_middle_tile from "./assets/tile/grass_middle_tile.png";

const Game = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      physics: {
        default: "arcade",
        arcade: { debug: false },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    const game = new Phaser.Game(config);
    let player: Phaser.Physics.Arcade.Sprite;
    let cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    let lastDirection = "front";
    let farmlandGroup: Phaser.Physics.Arcade.StaticGroup;

    function preload(this: Phaser.Scene) {
      // Load walk animations
      this.load.spritesheet("front_face_walk", front_face_walk, {
        frameWidth: 32,
        frameHeight: 30,
      });
      this.load.spritesheet("side_face_walk", side_face_walk, {
        frameWidth: 32,
        frameHeight: 30,
      });
      this.load.spritesheet("back_face_walk", back_face_walk, {
        frameWidth: 32,
        frameHeight: 30,
      });

      // Load idle animations
      this.load.spritesheet("front_face_idle", front_face_idle, {
        frameWidth: 32,
        frameHeight: 30,
      });
      this.load.spritesheet("side_face_idle", side_face_idle, {
        frameWidth: 32,
        frameHeight: 30,
      });
      this.load.spritesheet("back_face_idle", back_face_idle, {
        frameWidth: 32,
        frameHeight: 30,
      });

      // Load tile images
      this.load.image("farm_land", farm_land_tile);
      this.load.image("grass_middle", grass_middle_tile);
    }

    function create(this: Phaser.Scene) {
      const worldWidth = 800;
      const worldHeight = 600;

      // Fill the world with grass (16x16 tiles)
      for (let y = 0; y < worldHeight; y += 16) {
        for (let x = 0; x < worldWidth; x += 16) {
          this.add.image(x, y, "grass_middle").setOrigin(0);
        }
      }

      farmlandGroup = this.physics.add.staticGroup();

      for (let y = 0; y < worldHeight; y += 96) {
        for (let x = 0; x < worldWidth; x += 96) {
          const farmlandTile = farmlandGroup.create(
            x + 24,
            y + 24,
            "farm_land"
          );
          farmlandTile.setOrigin(0.5);
        }
      }

      // Create player sprite
      player = this.physics.add.sprite(400, 300, "front_face_idle");
      player.setCollideWorldBounds(true);

      player.body?.setSize(18, 20);
      this.physics.add.collider(player, farmlandGroup);

      // Create walk animations
      this.anims.create({
        key: "walk_facing_front",
        frames: this.anims.generateFrameNumbers("front_face_walk", {
          start: 0,
          end: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "walk_facing_side",
        frames: this.anims.generateFrameNumbers("side_face_walk", {
          start: 0,
          end: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
      this.anims.create({
        key: "walk_facing_back",
        frames: this.anims.generateFrameNumbers("back_face_walk", {
          start: 0,
          end: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });

      // Create idle animations
      this.anims.create({
        key: "idle_facing_front",
        frames: this.anims.generateFrameNumbers("front_face_idle", {
          start: 0,
          end: 1,
        }),
        frameRate: 2,
        repeat: -1,
      });
      this.anims.create({
        key: "idle_facing_side",
        frames: this.anims.generateFrameNumbers("side_face_idle", {
          start: 0,
          end: 1,
        }),
        frameRate: 2,
        repeat: -1,
      });
      this.anims.create({
        key: "idle_facing_back",
        frames: this.anims.generateFrameNumbers("back_face_idle", {
          start: 0,
          end: 1,
        }),
        frameRate: 2,
        repeat: -1,
      });

      // Enable keyboard input
      cursors = this.input.keyboard?.createCursorKeys();
    }

    function update(this: Phaser.Scene) {
      if (!player || !cursors) return;

      player.setVelocity(0);
      let moving = false;

      if (cursors.left.isDown) {
        player.setVelocityX(-100);
        player.play("walk_facing_side", true);
        player.setFlipX(true);
        lastDirection = "side";
        moving = true;
      } else if (cursors.right.isDown) {
        player.setVelocityX(100);
        player.play("walk_facing_side", true);
        player.setFlipX(false);
        lastDirection = "side";
        moving = true;
      } else if (cursors.up.isDown) {
        player.setVelocityY(-100);
        player.play("walk_facing_back", true);
        lastDirection = "back";
        moving = true;
      } else if (cursors.down.isDown) {
        player.setVelocityY(100);
        player.play("walk_facing_front", true);
        lastDirection = "front";
        moving = true;
      }

      if (!moving) {
        player.play(`idle_facing_${lastDirection}`, true);
      }
    }

    return () => game.destroy(true);
  }, []);

  return <div id="game-container" />;
};

export default Game;
