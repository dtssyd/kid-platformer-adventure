// The hero. Handles movement/jumping, HP + invulnerability, and the three
// damage-dealing actions: stomp (handled by PlayScene's collision logic),
// sword swing (melee, unlimited), and throwing the world-specific item
// (limited, replenished by pickups).
class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.maxHp = 5;
    this.hp = this.maxHp;
    this.throwCount = 0;
    this.facing = 1;
    this.invulnerable = false;
    this.isAttacking = false;
    this.moveSpeed = 220;
    this.jumpSpeed = 480;

    this.setCollideWorldBounds(true);
    this.setDragX(900);
    this.setMaxVelocity(this.moveSpeed, 900);

    this.swordSprite = scene.add.sprite(x, y, 'sword');
    this.swordSprite.setOrigin(0.88, 0.5); // pivot near the hilt, so it swings from the hand
    this.swordSprite.setVisible(false);
    scene.physics.add.existing(this.swordSprite);
    this.swordSprite.body.setAllowGravity(false);
    this.swordSprite.body.enable = false;
    this.swordActive = false;

    this._swordCooldownUntil = 0;
    this._throwCooldownUntil = 0;
  }

  update(input) {
    var onGround = this.body.blocked.down || this.body.touching.down;

    if (input.left) {
      this.setVelocityX(-this.moveSpeed);
      this.facing = -1;
      this.setFlipX(true);
    } else if (input.right) {
      this.setVelocityX(this.moveSpeed);
      this.facing = 1;
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if (input.jump && onGround) {
      this.setVelocityY(-this.jumpSpeed);
    }

    if (input.sword) this.swingSword();
    if (input.throw) this.throwItem();

    if (this.swordActive) {
      var offset = this.facing === 1 ? 26 : -26;
      this.swordSprite.setFlipX(this.facing === -1);
      this.swordSprite.body.reset(this.x + offset, this.y + 4);
    }
  }

  swingSword() {
    var now = this.scene.time.now;
    if (now < this._swordCooldownUntil) return;
    this._swordCooldownUntil = now + 340;

    this.swordActive = true;
    this.swordSprite.setVisible(true);
    this.swordSprite.setAlpha(1);
    this.swordSprite.body.enable = true;
    this.swordSprite.setScale(0.82);
    this.swordSprite.angle = this.facing === 1 ? -55 : -125;

    this.scene.tweens.add({
      targets: this.swordSprite,
      angle: this.facing === 1 ? 45 : 225,
      scale: 1,
      duration: 190,
      ease: 'Sine.easeOut'
    });
    this.scene.tweens.add({
      targets: this.swordSprite,
      alpha: 0,
      delay: 120,
      duration: 95,
      ease: 'Sine.easeIn'
    });

    this.scene.time.delayedCall(215, () => {
      this.swordActive = false;
      this.swordSprite.setVisible(false);
      this.swordSprite.body.enable = false;
    });
  }

  throwItem() {
    var now = this.scene.time.now;
    if (now < this._throwCooldownUntil) return;
    if (this.throwCount <= 0) {
      this.scene.events.emit('throwEmpty');
      return;
    }
    this._throwCooldownUntil = now + 350;

    this.throwCount -= 1;
    this.scene.events.emit('throwCountChanged');
    var proj = new Projectile(this.scene, this.x + this.facing * 20, this.y - 4, 'acorn', this.facing, 'player', 1, 340);
    this.scene.playerProjectiles.add(proj);
  }

  bounceOffStomp() {
    this.setVelocityY(-360);
  }

  takeDamage(amount, sourceX) {
    if (this.invulnerable || this.hp <= 0) return;
    this.hp -= amount || 1;
    this.scene.events.emit('hpChanged');

    var away = sourceX != null && sourceX > this.x ? -1 : 1;
    this.setVelocityX(away * 260);
    this.setVelocityY(-260);

    this.invulnerable = true;
    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 8,
      onComplete: () => { this.alpha = 1; }
    });
    this.scene.time.delayedCall(900, () => { this.invulnerable = false; });

    if (this.hp <= 0) {
      this.scene.events.emit('playerDied');
    }
  }

  respawnAtCheckpoint(x, y) {
    if (!this.invulnerable) this.takeDamage(1, null);
    this.body.reset(x, y);
  }
}
