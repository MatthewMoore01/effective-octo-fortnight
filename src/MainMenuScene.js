class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    const { width, height } = this.sys.game.config;
    // Background
    this.add.tileSprite(0, 0, width, height, 'bg').setOrigin(0);
    // Title text
    this.add
      .text(width / 2, height / 4, 'Crowd Runner', {
        fontSize: '32px',
        fill: '#ffffff'
      })
      .setOrigin(0.5);
    // Get unlocked levels from localStorage
    const unlocked = parseInt(localStorage.getItem('unlockedLevel')) || 1;
    // Level buttons
    for (let i = 1; i <= 5; i++) {
      const canPlay = i <= unlocked;
      const txt = this.add
        .text(width / 2, height / 2 + i * 30, `Level ${i}`, {
          fontSize: '24px',
          fill: canPlay ? '#00ff00' : '#888888'
        })
        .setOrigin(0.5);
      if (canPlay) {
        txt.setInteractive({ useHandCursor: true });
        txt.on('pointerdown', () => {
          this.scene.start('GameScene', { level: i });
        });
      }
    }
  }
}

export default MainMenuScene;