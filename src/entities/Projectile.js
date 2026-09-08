// A simple thrown/shot projectile used by both the player's thrown item
// and boss ranged attacks. `owner` is 'player' or 'enemy' and decides who
// it can damage (checked by the scene's overlap callbacks).
class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, textureKey, direction, owner, damage, speed) {
    super(scene, x, y, textureKey);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.owner = owner;
    this.damage = damage || 1;
    this.body.setAllowGravity(false);
    this.setVelocityX((speed || 260) * direction);
    this.setFlipX(direction < 0);

    scene.time.delayedCall(2500, () => { if (this.active) this.destroy(); });
  }
}
