// A platform that patrols back and forth between minX and maxX. Arcade
// Physics doesn't automatically "carry" a player standing on a moving
// solid, so PlayScene tracks each platform's per-frame movement (deltaX)
// and nudges the player by the same amount while they're standing on it.
class MovingPlatform extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, opts) {
    super(scene, x, y, 'platform');
    opts = opts || {};
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setImmovable(true);
    this.body.setAllowGravity(false);
    this.setTint(0xbfe3ff); // light icy tint distinguishes it from static wooden platforms

    this.minX = opts.minX != null ? opts.minX : x - 80;
    this.maxX = opts.maxX != null ? opts.maxX : x + 80;
    this.speed = opts.speed || 70;
    this.direction = opts.startDirection || 1;
    this.prevX = x;
    this.deltaX = 0;
  }

  update() {
    this.deltaX = this.x - this.prevX;
    this.prevX = this.x;

    if (this.x <= this.minX) this.direction = 1;
    else if (this.x >= this.maxX) this.direction = -1;
    this.setVelocityX(this.speed * this.direction);
  }
}
