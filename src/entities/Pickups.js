// Small, mostly-static level objects: coins, hazards, and pickups.
// Kept in one file since each is a thin wrapper around a Phaser sprite.

class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'coin');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    scene.tweens.add({ targets: this, y: y - 8, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  collect(scene) {
    if (!this.active) return;
    GameState.score += 1;
    scene.events.emit('scoreChanged');
    this.destroy();
  }
}

class Spike extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'spike');
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }
}

class Spring extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'spring');
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }

  bounce(player) {
    player.setVelocityY(-720);
    player.scene.tweens.add({ targets: this, scaleY: 0.6, duration: 80, yoyo: true });
  }
}

class Crate extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'crate');
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }
}

class Signpost extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'signpost');
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
  }
}

class ThrowItemPickup extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'acorn');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    scene.tweens.add({ targets: this, y: y - 6, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  collect(scene, player) {
    if (!this.active) return;
    player.throwCount += 1;
    scene.events.emit('throwCountChanged');
    this.destroy();
  }
}
