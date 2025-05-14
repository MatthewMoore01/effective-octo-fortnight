class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }
  init(data) {
    this.level = data.level || 1;
  }
  create() {
    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;
    // Track dimensions (walls are 50px each side)
    const wallWidth = 50;
    this.trackX = wallWidth;
    this.trackWidth = width - wallWidth * 2;
    // Cell and spacing
    this.cellSize = 16;
    this.gateH = 40;
    this.gateW = this.trackWidth / 2 - 10;
    this.gateSpacing = 200;
    this.waveOffset = 100;
    this.scrollSpeed = 100;
    // Player state
    this.count = 1;
    this.waveIndex = 0;
    this.offsetY = 0;
    this.gameOver = false;
    this.gameWin = false;
    // Background & walls
    this.add.tileSprite(0, 0, width, height, 'bg').setOrigin(0);
    this.add.tileSprite(0, 0, wallWidth, height, 'wall').setOrigin(0);
    this.add.tileSprite(width - wallWidth, 0, wallWidth, height, 'wall').setOrigin(0);
    // Player square
    this.player = this.add.rectangle(
      this.trackX + this.trackWidth / 2,
      height - this.cellSize - 20,
      this.cellSize,
      this.cellSize,
      0x0000ff
    ).setOrigin(0.5);
    this.playerY = this.player.y;
    this.playerSpeed = 200;
    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey('A');
    this.keyD = this.input.keyboard.addKey('D');
    // HUD
    this.countText = this.add.text(10, 10, '', { fontSize: '16px', fill: '#fff' });
    this.levelText = this.add.text(10, 30, '', { fontSize: '16px', fill: '#fff' });
    this.waveText = this.add.text(10, 50, '', { fontSize: '16px', fill: '#fff' });
    // Scroll container
    this.scroll = this.add.container(0, 0);
    // Generate level data (solvable)
    this.gateDefs = [];
    this.waveDefs = [];
    const allowedMap = {
      1: ['+'],
      2: ['+', '-'],
      3: ['+', '-'],
      4: ['+', '-', '*'],
      5: ['+', '-', '*', '/']
    };
    const allowed = allowedMap[this.level] || ['+'];
    let maxCount = 1;
    for (let i = 0; i < 10; i++) {
      let op1, op2, val1, val2, res1, res2, best;
      do {
        op1 = Phaser.Utils.Array.GetRandom(allowed);
        op2 = Phaser.Utils.Array.GetRandom(allowed);
        val1 = this.getVal(op1);
        val2 = this.getVal(op2);
        res1 = this.calc(maxCount, op1, val1);
        res2 = this.calc(maxCount, op2, val2);
        best = Math.max(res1, res2);
      } while (best < 2);
      const waveCount = Phaser.Math.Between(1, best - 1);
      const y0 = -(i + 1) * this.gateSpacing;
      this.gateDefs.push({ op1, val1, op2, val2, y0, processed: false });
      this.waveDefs.push({ count: waveCount, y0: y0 - this.waveOffset, processed: false });
      maxCount = best - waveCount;
    }
    // Create gate visuals
    for (let g of this.gateDefs) {
      const x1 = this.trackX + this.gateW / 2 + 5;
      const x2 = this.trackX + this.trackWidth - this.gateW / 2 - 5;
      const rect1 = this.add.rectangle(x1, g.y0, this.gateW, this.gateH, 0x888888).setOrigin(0.5);
      const txt1 = this.add.text(x1, g.y0, g.op1 + g.val1, { fontSize: '18px', fill: '#000' }).setOrigin(0.5);
      const rect2 = this.add.rectangle(x2, g.y0, this.gateW, this.gateH, 0x888888).setOrigin(0.5);
      const txt2 = this.add.text(x2, g.y0, g.op2 + g.val2, { fontSize: '18px', fill: '#000' }).setOrigin(0.5);
      g.objects = [rect1, txt1, rect2, txt2];
      this.scroll.add(g.objects);
    }
    // Create wave visuals
    const cols = Math.floor(this.trackWidth / this.cellSize);
    for (let w of this.waveDefs) {
      w.objects = [];
      for (let i = 0; i < w.count; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = this.trackX + col * this.cellSize + this.cellSize / 2;
        const y = w.y0 + row * this.cellSize + this.cellSize / 2;
        const rect = this.add.rectangle(x, y, this.cellSize - 2, this.cellSize - 2, 0xff0000).setOrigin(0.5);
        w.objects.push(rect);
        this.scroll.add(rect);
      }
    }
  }
  getVal(op) {
    if (op === '+' || op === '-') return Phaser.Math.Between(1, 5);
    if (op === '*' || op === '/') return Phaser.Math.Between(2, 3);
    return 1;
  }
  calc(c, op, v) {
    switch (op) {
      case '+': return c + v;
      case '-': return c - v;
      case '*': return c * v;
      case '/': return Math.floor(c / v);
    }
    return c;
  }
  update(time, delta) {
    if (this.gameOver || this.gameWin) return;
    const dt = delta / 1000;
    // Move player
    if (this.cursors.left.isDown || this.keyA.isDown) {
      this.player.x -= this.playerSpeed * dt;
    } else if (this.cursors.right.isDown || this.keyD.isDown) {
      this.player.x += this.playerSpeed * dt;
    }
    const minX = this.trackX + this.player.width / 2;
    const maxX = this.trackX + this.trackWidth - this.player.width / 2;
    this.player.x = Phaser.Math.Clamp(this.player.x, minX, maxX);
    // Scroll world
    this.offsetY += this.scrollSpeed * dt;
    this.scroll.y = this.offsetY;
    // Gates collision
    for (let g of this.gateDefs) {
      if (!g.processed) {
        const y = g.y0 + this.offsetY;
        if (y + this.gateH / 2 >= this.playerY - this.cellSize / 2) {
          const mid = this.sys.game.config.width / 2;
          const leftSide = this.player.x < mid;
          const op = leftSide ? g.op1 : g.op2;
          const val = leftSide ? g.val1 : g.val2;
          this.count = this.calc(this.count, op, val);
          this.count = Math.max(1, this.count);
          g.processed = true;
          g.objects.forEach(o => o.setVisible(false));
        }
      }
    }
    // Waves collision
    if (this.waveIndex < this.waveDefs.length) {
      const w = this.waveDefs[this.waveIndex];
      if (!w.processed) {
        const y = w.y0 + this.offsetY;
        if (y + this.cellSize / 2 >= this.playerY + this.cellSize / 2) {
          w.processed = true;
          if (this.count >= w.count) {
            this.count -= w.count;
            w.objects.forEach(o => o.setVisible(false));
            this.waveIndex++;
            if (this.waveIndex >= this.waveDefs.length) {
              this.gameWin = true;
              // Unlock next level if applicable
              const prev = parseInt(localStorage.getItem('unlockedLevel')) || 1;
              if (this.level >= prev && this.level < 5) {
                localStorage.setItem('unlockedLevel', this.level + 1);
              }
              this.showEnd('Level Complete!', 0x00ff00);
            }
          } else {
            this.gameOver = true;
            this.showEnd('Game Over', 0xff0000);
          }
        }
      }
    }
    // HUD update
    this.countText.setText(`Count: ${this.count}`);
    this.levelText.setText(`Level: ${this.level}`);
    this.waveText.setText(`Wave: ${Math.min(this.waveIndex+1, this.waveDefs.length)}/${this.waveDefs.length}`);
  }
  showEnd(msg, color) {
    const { width, height } = this.sys.game.config;
    this.add.text(width/2, height/2, msg, { fontSize: '32px', fill: Phaser.Display.Color.IntegerToColor(color).rgba }).setOrigin(0.5);
  }
}

export default GameScene;