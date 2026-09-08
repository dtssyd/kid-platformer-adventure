class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    var w = this.scale.width, h = this.scale.height;

    this.add.rectangle(0, 0, w, h, 0x2f8f5a).setOrigin(0);
    this.add.text(w / 2, h * 0.28, 'Kid Platformer Adventure', {
      fontFamily: 'sans-serif', fontSize: '42px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.45,
      'Move: Arrows/WASD or on-screen buttons\nJump: Space/Up\nSword: X   Throw: C',
      { fontFamily: 'sans-serif', fontSize: '18px', color: '#eaffea', align: 'center' }
    ).setOrigin(0.5);

    var startBtn = this.add.text(w / 2, h * 0.68, 'Tap / Click to Start', {
      fontFamily: 'sans-serif', fontSize: '26px', color: '#fff', backgroundColor: '#1f6b3a',
      padding: { x: 24, y: 12 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    startBtn.on('pointerdown', () => {
      GameState.reset();
      this.scene.start('PlayScene', { levelIndex: 0 });
    });
  }
}
