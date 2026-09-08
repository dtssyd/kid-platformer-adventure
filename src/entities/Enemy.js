// Regular "bug" enemy: walks back and forth within [minX, maxX], has a
// small amount of HP, and can be defeated by a stomp, sword swing, or
// thrown item. Touching it from the side (not a stomp) damages the player.
class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, opts) {
    super(scene, x, y, 'bug');
    opts = opts || {};
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.hp = opts.hp || 1;
    this.contactDamage = opts.contactDamage || 1;
    this.speed = opts.speed || 60;
    this.minX = opts.minX != null ? opts.minX : x - 100;
    this.maxX = opts.maxX != null ? opts.maxX : x + 100;
    this.direction = 1;
    this.defeated = false;

    this.setVelocityX(this.speed * this.direction);
    this.setCollideWorldBounds(true);
    this.setBounce(0);
  }

  update() {
    if (this.defeated) return;
    if (this.x <= this.minX) this.direction = 1;
    else if (this.x >= this.maxX) this.direction = -1;
    this.setVelocityX(this.speed * this.direction);
    this.setFlipX(this.direction < 0);
  }

  takeDamage(amount) {
    if (this.defeated) return;
    this.hp -= amount || 1;
    if (this.hp <= 0) {
      this.defeat();
    } else {
      this.scene.tweens.add({ targets: this, alpha: 0.3, duration: 80, yoyo: true, repeat: 2 });
    }
  }

  defeat() {
    if (this.defeated) return;
    this.defeated = true;
    this.body.enable = false;
    this.scene.tweens.add({
      targets: this,
      scaleY: 0.15,
      alpha: 0,
      duration: 220,
      onComplete: () => this.destroy()
    });
  }
}
