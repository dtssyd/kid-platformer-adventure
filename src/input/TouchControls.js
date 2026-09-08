// On-screen touch controls for tablet play: a left/right pair and
// jump/sword/throw buttons, fixed to the camera. Also usable with a mouse
// on desktop. Keyboard input (handled in PlayScene) works independently.
class TouchControls {
  constructor(scene) {
    this.scene = scene;
    this.state = { left: false, right: false, jump: false, sword: false, throw: false };
    this._buttons = [];
    this._build();
    scene.scale.on('resize', () => this._reposition());
  }

  _makeButton(label, caption, key, x, y, radius) {
    var scene = this.scene;
    var circle = scene.add.circle(x, y, radius, 0xffffff, 0.28)
      .setScrollFactor(0)
      .setDepth(1000)
      .setStrokeStyle(2, 0xffffff, 0.6)
      .setInteractive({ useHandCursor: true });
    var text = scene.add.text(x, y, label, {
      fontFamily: 'sans-serif', fontSize: radius * 0.7 + 'px', color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
    var captionText = null;
    if (caption) {
      captionText = scene.add.text(x, y + radius + 10, caption, {
        fontFamily: 'sans-serif', fontSize: '11px', color: '#ffffff'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(1001).setAlpha(0.75);
    }

    var setDown = () => { this.state[key] = true; circle.setFillStyle(0xffffff, 0.55); };
    var setUp = () => { this.state[key] = false; circle.setFillStyle(0xffffff, 0.28); };

    circle.on('pointerdown', setDown);
    circle.on('pointerup', setUp);
    circle.on('pointerout', setUp);

    this._buttons.push({ circle: circle, text: text, captionText: captionText, key: key, baseRadius: radius });
    return { circle: circle, text: text };
  }

  _build() {
    var w = this.scene.scale.width;
    var h = this.scene.scale.height;
    var r = Math.max(30, Math.min(w, h) * 0.07);

    this.leftBtn = this._makeButton('◀', null, 'left', r * 1.4, h - r * 1.4, r);
    this.rightBtn = this._makeButton('▶', null, 'right', r * 3.2, h - r * 1.4, r);

    this.jumpBtn = this._makeButton('⤒', 'JUMP', 'jump', w - r * 1.4, h - r * 1.4, r);
    this.swordBtn = this._makeButton('⚔', 'SWORD', 'sword', w - r * 3.2, h - r * 2.6, r * 0.85);
    this.throwBtn = this._makeButton('●', 'THROW', 'throw', w - r * 1.4, h - r * 3.2, r * 0.85);
  }

  _reposition() {
    this._buttons.forEach((b) => { b.circle.destroy(); b.text.destroy(); if (b.captionText) b.captionText.destroy(); });
    this._buttons = [];
    this._build();
  }

  destroy() {
    this._buttons.forEach((b) => { b.circle.destroy(); b.text.destroy(); if (b.captionText) b.captionText.destroy(); });
  }
}
