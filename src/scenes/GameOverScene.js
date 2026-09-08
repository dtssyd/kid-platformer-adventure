class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }

  init(data) { this.won = !!(data && data.won); }

  create() {
    var w = this.scale.width, h = this.scale.height;
    this.add.rectangle(0, 0, w, h, this.won ? 0x1f6b3a : 0x3a1f1f).setOrigin(0);

    this.add.text(w / 2, h * 0.32, this.won ? 'World 1 Complete!' : 'Game Over', {
      fontFamily: 'sans-serif', fontSize: '40px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.46, 'Coins collected: ' + GameState.score, {
      fontFamily: 'sans-serif', fontSize: '20px', color: '#ffffff'
    }).setOrigin(0.5);

    var retry = this.add.text(w / 2, h * 0.64, this.won ? 'Play Again' : 'Retry', {
      fontFamily: 'sans-serif', fontSize: '24px', color: '#fff', backgroundColor: '#000000aa',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    retry.on('pointerdown', () => {
      GameState.reset();
      this.scene.start('PlayScene', { levelIndex: 0 });
    });

    var menu = this.add.text(w / 2, h * 0.76, 'Main Menu', {
      fontFamily: 'sans-serif', fontSize: '18px', color: '#ffffff', backgroundColor: '#00000066',
      padding: { x: 16, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menu.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
