class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // no external assets to load
  }

  create() {
    // Generate procedural textures
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Background
    g.fillStyle(0x223344, 1);
    g.fillRect(0, 0, 640, 360);
    g.generateTexture('bg', 640, 360);
    g.clear();
    // Tunnel wall slice
    g.fillStyle(0x555555, 1);
    g.fillRect(0, 0, 50, 360);
    g.generateTexture('wall', 50, 360);
    g.clear();
    // We only need background and walls for the basic game; other shapes drawn directly in GameScene
    // Start main menu
    this.scene.start('MainMenuScene');
  }
}

export default BootScene;