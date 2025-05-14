import BootScene from './BootScene.js';
import MainMenuScene from './MainMenuScene.js';
import GameScene from './GameScene.js';

const config = {
  type: Phaser.CANVAS,
  width: 640,
  height: 360,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scene: [BootScene, MainMenuScene, GameScene]
};

// Instantiate the Phaser game
new Phaser.Game(config);