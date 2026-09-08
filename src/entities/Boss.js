// Mini-boss / final-boss entity. Same damage rules as Enemy (stomp, sword,
// thrown item) but with a health bar, a simple charge-attack pattern, and
// an optional "phase 2" that kicks in once HP drops below a threshold
// (used later by the level 10 final boss for a faster/second pattern).
// One shared class drives every boss (levels 2, 4, 6, 8, 10) — only the
// per-level config numbers change, which is what makes new boss levels
// cheap to add later.
class Boss extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, opts) {
    super(scene, x, y, 'boss');
    opts = opts || {};
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.maxHp = opts.hp || 6;
    this.hp = this.maxHp;
    this.contactDamage = opts.contactDamage || 1;
    this.walkSpeed = opts.walkSpeed || 40;
    this.chargeSpeed = opts.chargeSpeed || 220;
    this.minX = opts.minX != null ? opts.minX : x - 160;
    this.maxX = opts.maxX != null ? opts.maxX : x + 160;
    this.phase2AtFraction = opts.phase2AtFraction != null ? opts.phase2AtFraction : 0.5;
    this.name = opts.name || 'Big Bad';

    this.direction = 1;
    this.defeated = false;
    this.phase = 1;
    this.state = 'walk';
    this.setCollideWorldBounds(true);

    this._scheduleNextCharge();
  }

  _scheduleNextCharge() {
    var delay = this.phase === 2 ? Phaser.Math.Between(1200, 2000) : Phaser.Math.Between(2000, 3200);
    this.chargeTimer = this.scene.time.delayedCall(delay, () => this._startCharge());
  }

  _startCharge() {
    if (this.defeated) return;
    this.state = 'charge';
    var target = this.scene.player;
    this.direction = target && target.x < this.x ? -1 : 1;
    this.scene.time.delayedCall(700, () => {
      if (this.defeated) return;
      this.state = 'walk';
      this._scheduleNextCharge();
    });
  }

  update() {
    if (this.defeated) return;

    if (this.state === 'walk') {
      if (this.x <= this.minX) this.direction = 1;
      else if (this.x >= this.maxX) this.direction = -1;
      this.setVelocityX(this.walkSpeed * this.direction);
    } else {
      this.setVelocityX(this.chargeSpeed * this.direction);
      if (this.x <= this.minX) this.direction = 1;
      if (this.x >= this.maxX) this.direction = -1;
    }
    this.setFlipX(this.direction < 0);
  }

  takeDamage(amount) {
    if (this.defeated) return;
    this.hp -= amount || 1;
    this.scene.events.emit('bossHpChanged', this);

    if (this.hp <= 0) {
      this.defeat();
      return;
    }

    if (this.phase === 1 && this.hp / this.maxHp <= this.phase2AtFraction) {
      this.phase = 2;
      this.scene.events.emit('bossPhase2', this);
    }

    this.scene.tweens.add({ targets: this, alpha: 0.3, duration: 80, yoyo: true, repeat: 2 });
  }

  defeat() {
    if (this.defeated) return;
    this.defeated = true;
    this.body.enable = false;
    if (this.chargeTimer) this.chargeTimer.remove();
    this.scene.events.emit('bossDefeated', this);
    this.scene.tweens.add({
      targets: this,
      scaleY: 0.1,
      alpha: 0,
      duration: 400,
      onComplete: () => this.destroy()
    });
  }
}
