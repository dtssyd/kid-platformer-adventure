// Level-clear trigger: a portal (odd levels) or a flag (boss levels).
class Goal extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    super(scene, x, y, type === 'flag' ? 'flag' : 'portal');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.reached = false;
  }
}
