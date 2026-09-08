class PlayScene extends Phaser.Scene {
  constructor() { super('PlayScene'); }

  init(data) {
    this.levelIndex = data.levelIndex || 0;
  }

  create() {
    var levelData = LEVEL_MANIFEST[this.levelIndex];
    this.levelData = levelData;
    this.goalReached = false;

    this.physics.world.setBounds(0, 0, levelData.width, levelData.height);
    // Solid on the left/right/top, but NOT the bottom — falling into a pit
    // has to actually fall out of the world so the fall-death check below
    // can fire, otherwise "collide with world bounds" quietly catches the
    // player on an invisible floor and the game looks stuck forever.
    this.physics.world.setBoundsCollision(true, true, true, false);
    this.cameras.main.setBackgroundColor(levelData.bgColor || 0x9fd8ef);

    this._buildBackground(levelData);
    this._buildWorld(levelData);

    this.player = new Player(this, levelData.playerStart.x, levelData.playerStart.y);
    this.playerProjectiles = this.physics.add.group({ allowGravity: false });

    this._buildBoss(levelData);
    this._buildGoal(levelData);
    this._setupColliders();

    this.cameras.main.setBounds(0, 0, levelData.width, levelData.height);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    this.keys = this.input.keyboard.addKeys({
      left: 'LEFT', right: 'RIGHT', up: 'UP', down: 'DOWN',
      a: 'A', d: 'D', w: 'W', space: 'SPACE', x: 'X', c: 'C'
    });
    this.touch = new TouchControls(this);

    this._buildHud(levelData);
    this._wireEvents();
  }

  // ---------- world building ----------

  _buildBackground(levelData) {
    var far = this.add.tileSprite(0, 0, levelData.width, levelData.height, 'bgFar').setOrigin(0, 0);
    far.setScrollFactor(0.2);
    var mid = this.add.tileSprite(0, 0, levelData.width, levelData.height, 'bgMid').setOrigin(0, 0);
    mid.setScrollFactor(0.5);
  }

  _fillSpan(group, x1, x2, topY, textureKey, tileW, tileH) {
    for (var x = x1; x < x2; x += tileW) {
      var tile = group.create(x + tileW / 2, topY + tileH / 2, textureKey);
      tile.refreshBody && tile.refreshBody();
    }
  }

  _buildWorld(levelData) {
    this.groundGroup = this.physics.add.staticGroup();
    levelData.ground.forEach((span) => this._fillSpan(this.groundGroup, span.x1, span.x2, span.y, 'ground', 64, 64));
    this._buildUndergroundFill(levelData);

    this.platformGroup = this.physics.add.staticGroup();
    (levelData.platforms || []).forEach((span) => this._fillSpan(this.platformGroup, span.x1, span.x2, span.y, 'platform', 64, 20));

    // allowGravity/immovable are set here on the GROUP, not just on each
    // MovingPlatform instance — Group.add() silently resets a body's own
    // flags back to the group's defaults, so setting them only in the
    // entity's constructor doesn't stick once it's added to a group.
    this.movingPlatformGroup = this.physics.add.group({ allowGravity: false, immovable: true });
    (levelData.movingPlatforms || []).forEach((p) => this.movingPlatformGroup.add(new MovingPlatform(this, p.x, p.y, p)));

    this.spikeGroup = this.physics.add.staticGroup();
    (levelData.spikes || []).forEach((s) => this.spikeGroup.add(new Spike(this, s.x, s.y)));

    this.springGroup = this.physics.add.staticGroup();
    (levelData.springs || []).forEach((s) => this.springGroup.add(new Spring(this, s.x, s.y)));

    this.crateGroup = this.physics.add.staticGroup();
    (levelData.crates || []).forEach((s) => this.crateGroup.add(new Crate(this, s.x, s.y)));

    (levelData.signposts || []).forEach((s) => new Signpost(this, s.x, s.y));

    // allowGravity:false on the group, not just the entity — see the
    // moving-platform group above for why the entity's own setting alone
    // isn't enough. Coins/acorns were masked by their bob tween fighting
    // gravity every frame rather than actually being unaffected by it.
    this.coinGroup = this.physics.add.group({ allowGravity: false });
    (levelData.coins || []).forEach((c) => this.coinGroup.add(new Coin(this, c.x, c.y)));

    this.throwPickupGroup = this.physics.add.group({ allowGravity: false });
    (levelData.throwPickups || []).forEach((t) => this.throwPickupGroup.add(new ThrowItemPickup(this, t.x, t.y)));

    this.enemyGroup = this.physics.add.group();
    (levelData.enemies || []).forEach((e) => this.enemyGroup.add(new Enemy(this, e.x, e.y, e)));
  }

  // Solid-color fill directly beneath each ground span, down to the level's
  // full height, so a taller-than-usual viewport (a tablet, a maximized
  // desktop window) never reveals blank space under the ground strip.
  // Deliberately left out under gaps/pits — a gap dropping into open sky is
  // the intended hazard visual, not something to patch over.
  _buildUndergroundFill(levelData) {
    var fillColor = 0x6b4a2b;
    levelData.ground.forEach((span) => {
      var top = span.y + 64;
      var height = levelData.height - top;
      if (height <= 0) return;
      this.add.rectangle(span.x1 + (span.x2 - span.x1) / 2, top + height / 2, span.x2 - span.x1, height, fillColor).setOrigin(0.5);
    });
  }

  _buildBoss(levelData) {
    this.boss = null;
    if (levelData.boss) {
      this.boss = new Boss(this, levelData.boss.x, levelData.boss.y, levelData.boss);
    }
  }

  _buildGoal(levelData) {
    this.goal = new Goal(this, levelData.goal.x, levelData.goal.y, levelData.goal.type);
  }

  // ---------- collisions ----------

  _setupColliders() {
    var solids = [this.groundGroup, this.platformGroup];
    var self = this;

    solids.forEach((g) => {
      this.physics.add.collider(this.player, g);
      this.physics.add.collider(this.enemyGroup, g);
      if (this.boss) this.physics.add.collider(this.boss, g);
      this.physics.add.collider(this.playerProjectiles, g, (proj) => proj.destroy());
    });

    this.physics.add.collider(this.player, this.crateGroup);
    this.physics.add.collider(this.player, this.movingPlatformGroup);
    this.physics.add.collider(this.playerProjectiles, this.movingPlatformGroup, (proj) => proj.destroy());

    this.physics.add.overlap(this.player, this.spikeGroup, (player, spike) => player.takeDamage(1, spike.x));
    this.physics.add.overlap(this.player, this.springGroup, (player, spring) => this._onSpringOverlap(player, spring));
    this.physics.add.overlap(this.player, this.coinGroup, (player, coin) => coin.collect(self));
    this.physics.add.overlap(this.player, this.throwPickupGroup, (player, item) => item.collect(self, player));

    this.physics.add.overlap(this.player, this.enemyGroup, (player, enemy) => this._onPlayerVsFoe(player, enemy));
    this.physics.add.overlap(this.player.swordSprite, this.enemyGroup, (sword, enemy) => this._onSwordHitFoe(enemy));
    this.physics.add.overlap(this.playerProjectiles, this.enemyGroup, (proj, enemy) => this._onProjectileHitFoe(proj, enemy));

    if (this.boss) {
      this.physics.add.overlap(this.player, this.boss, (player, boss) => this._onPlayerVsFoe(player, boss));
      this.physics.add.overlap(this.player.swordSprite, this.boss, () => this._onSwordHitFoe(this.boss));
      this.physics.add.overlap(this.playerProjectiles, this.boss, (proj) => this._onProjectileHitFoe(proj, this.boss));
    }

    this.physics.add.overlap(this.player, this.goal, () => this._onGoalOverlap());
  }

  _isStomp(player, foe) {
    return player.body.velocity.y >= 0 && (player.body.bottom - foe.body.top) < 22;
  }

  _onPlayerVsFoe(player, foe) {
    if (foe.defeated) return;
    if (this._isStomp(player, foe)) {
      foe.takeDamage(1);
      player.bounceOffStomp();
      this._spawnHitSpark(foe.x, foe.body.top);
    } else {
      player.takeDamage(foe.contactDamage, foe.x);
    }
  }

  _onSwordHitFoe(foe) {
    if (foe.defeated) return;
    foe.takeDamage(1);
    this.player.swordSprite.body.enable = false;
    this._spawnHitSpark(this.player.swordSprite.x, this.player.swordSprite.y);
  }

  _onProjectileHitFoe(proj, foe) {
    if (proj.owner !== 'player' || foe.defeated) return;
    foe.takeDamage(proj.damage);
    this._spawnHitSpark(proj.x, proj.y);
    proj.destroy();
  }

  _spawnHitSpark(x, y) {
    var spark = this.add.image(x, y, 'hitSpark').setBlendMode('ADD').setScale(0.5);
    this.tweens.add({
      targets: spark,
      scale: 1.6,
      alpha: 0,
      duration: 220,
      ease: 'Cubic.easeOut',
      onComplete: () => spark.destroy()
    });
  }

  _onSpringOverlap(player, spring) {
    if (player.body.velocity.y >= 0 && (player.body.bottom - spring.body.top) < 24) {
      spring.bounce(player);
    }
  }

  _onGoalOverlap() {
    if (this.goalReached) return;
    if (this.boss && !this.boss.defeated) return; // flag/portal locked until the boss falls
    this.goalReached = true;
    this._completeLevel();
  }

  // ---------- HUD ----------

  _buildHud(levelData) {
    this.hearts = [];
    for (var i = 0; i < this.player.maxHp; i++) {
      this.hearts.push(this.add.image(26 + i * 26, 26, 'heart').setScrollFactor(0).setDepth(1000));
    }

    this.coinText = this.add.text(this.scale.width - 20, 20, '', {
      fontFamily: 'sans-serif', fontSize: '18px', color: '#ffffff'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(1000);

    this.throwText = this.add.text(this.scale.width - 20, 46, '', {
      fontFamily: 'sans-serif', fontSize: '18px', color: '#ffffff'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(1000);

    if (levelData.boss) {
      this.bossBarBg = this.add.rectangle(this.scale.width / 2, 26, 260, 18, 0x000000, 0.5)
        .setScrollFactor(0).setDepth(1000);
      this.bossBarFill = this.add.rectangle(this.scale.width / 2 - 128, 26, 256, 12, 0xcc2233)
        .setOrigin(0, 0.5).setScrollFactor(0).setDepth(1001);
      this.bossNameText = this.add.text(this.scale.width / 2, 10, levelData.boss.name, {
        fontFamily: 'sans-serif', fontSize: '13px', color: '#ffffff'
      }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(1001);
    }

    var banner = this.add.text(this.scale.width / 2, this.scale.height * 0.26, levelData.name, {
      fontFamily: 'sans-serif', fontSize: '30px', color: '#ffffff', backgroundColor: '#00000066',
      padding: { x: 16, y: 8 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1002);

    var controlHint = this.add.text(this.scale.width / 2, this.scale.height * 0.26 + 46,
      'Sword: X / ⚔️   Throw: C / ●', {
        fontFamily: 'sans-serif', fontSize: '15px', color: '#ffffff', backgroundColor: '#00000055',
        padding: { x: 10, y: 5 }
      }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(1002);

    [banner, controlHint].forEach((t) => {
      this.tweens.add({ targets: t, alpha: 0, delay: 2400, duration: 600, onComplete: () => t.destroy() });
    });

    this.scale.on('resize', () => this._layoutHud());
    this._refreshHud();
  }

  // Repositions the HUD elements anchored to the canvas edges/center —
  // called on creation and again whenever the canvas is resized (device
  // rotation, browser window resize).
  _layoutHud() {
    var w = this.scale.width;
    this.coinText.setPosition(w - 20, 20);
    this.throwText.setPosition(w - 20, 46);
    if (this.bossBarBg) {
      this.bossBarBg.setPosition(w / 2, 26);
      this.bossBarFill.setPosition(w / 2 - 128, 26);
      this.bossNameText.setPosition(w / 2, 10);
    }
  }

  _refreshHud() {
    for (var i = 0; i < this.hearts.length; i++) {
      this.hearts[i].setTexture(i < this.player.hp ? 'heart' : 'heartEmpty');
    }
    this.coinText.setText('Coins: ' + GameState.score);
    this.throwText.setText('Acorns: ' + this.player.throwCount);
    if (this.boss) {
      var frac = Phaser.Math.Clamp(this.boss.hp / this.boss.maxHp, 0, 1);
      this.bossBarFill.width = 256 * frac;
    }
  }

  _wireEvents() {
    this.events.on('hpChanged', () => this._refreshHud());
    this.events.on('scoreChanged', () => this._refreshHud());
    this.events.on('throwCountChanged', () => this._refreshHud());
    this.events.on('bossHpChanged', () => this._refreshHud());
    this.events.on('bossDefeated', () => {
      if (this.bossBarBg) { this.bossBarBg.destroy(); this.bossBarFill.destroy(); this.bossNameText.destroy(); }
    });
    this.events.on('playerDied', () => this._onPlayerDied());
    this.events.on('throwEmpty', () => this._flashNoAcorns());
  }

  _flashNoAcorns() {
    this.throwText.setColor('#ff6b6b');
    this.tweens.add({
      targets: this.throwText,
      scale: 1.3,
      duration: 90,
      yoyo: true,
      onComplete: () => this.throwText.setColor('#ffffff')
    });
  }

  // ---------- flow ----------

  _onPlayerDied() {
    GameState.lives -= 1;
    if (GameState.lives <= 0) {
      this.scene.start('GameOverScene', { won: false });
    } else {
      this.time.delayedCall(500, () => this.scene.restart({ levelIndex: this.levelIndex }));
    }
  }

  _completeLevel() {
    var msg = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Level Complete!', {
      fontFamily: 'sans-serif', fontSize: '36px', color: '#ffffff', backgroundColor: '#1f6b3a',
      padding: { x: 20, y: 12 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1003);

    this.time.delayedCall(1200, () => {
      msg.destroy();
      var next = this.levelIndex + 1;
      if (next < LEVEL_MANIFEST.length) {
        this.scene.start('PlayScene', { levelIndex: next });
      } else {
        this.scene.start('GameOverScene', { won: true });
      }
    });
  }

  // ---------- loop ----------

  update() {
    var kb = this.keys;
    var t = this.touch.state;

    var input = {
      left: kb.left.isDown || kb.a.isDown || t.left,
      right: kb.right.isDown || kb.d.isDown || t.right,
      jump: Phaser.Input.Keyboard.JustDown(kb.up) || Phaser.Input.Keyboard.JustDown(kb.w) ||
            Phaser.Input.Keyboard.JustDown(kb.space) || t.jump,
      sword: Phaser.Input.Keyboard.JustDown(kb.x) || t.sword,
      throw: Phaser.Input.Keyboard.JustDown(kb.c) || t.throw
    };

    this.player.update(input);
    this.enemyGroup.getChildren().forEach((e) => e.update());
    if (this.boss) this.boss.update();
    this.movingPlatformGroup.getChildren().forEach((p) => p.update());
    this._applyMovingPlatformCarry();

    if (this.player.y > this.levelData.groundY + 220) {
      this.player.respawnAtCheckpoint(this.levelData.playerStart.x, this.levelData.playerStart.y);
    }
  }

  // Arcade Physics collides the player with a moving platform but doesn't
  // carry them along for free, so: if the player is standing on top of a
  // specific platform, shift them by that platform's movement this frame.
  _applyMovingPlatformCarry() {
    var player = this.player;
    this.movingPlatformGroup.getChildren().forEach((p) => {
      if (!p.deltaX) return;
      var standingOnIt = player.body.touching.down &&
        player.body.bottom <= p.body.top + 6 &&
        player.body.right > p.body.left &&
        player.body.left < p.body.right;
      if (standingOnIt) {
        player.x += p.deltaX;
        player.body.updateFromGameObject();
      }
    });
  }
}
