// Procedurally-drawn placeholder art so the game is fully playable before
// the kids' ChatGPT-generated art is dropped in. Every texture key here is
// what a real PNG (see assets/README.md) would eventually replace.
function createPlaceholderTextures(scene) {
  var g = scene.add.graphics();

  function reset() { g.clear(); }
  function save(key, w, h) {
    g.generateTexture(key, w, h);
    g.clear();
  }

  // --- Player (40x56): red cap, tan face, blue overalls ---
  reset();
  g.fillStyle(0x3b6bd6, 1); g.fillRect(8, 30, 24, 26); // overalls
  g.fillStyle(0xf3c48a, 1); g.fillRect(10, 12, 20, 20); // face/head
  g.fillStyle(0xd6392b, 1); g.fillRect(6, 6, 28, 10); // cap
  g.fillRect(4, 10, 8, 4); // cap brim
  g.fillStyle(0x222222, 1); g.fillRect(14, 20, 4, 4); g.fillRect(24, 20, 4, 4); // eyes
  g.fillStyle(0xf3c48a, 1); g.fillRect(2, 32, 6, 14); g.fillRect(32, 32, 6, 14); // arms
  g.fillStyle(0x2b2b2b, 1); g.fillRect(10, 50, 8, 6); g.fillRect(22, 50, 8, 6); // shoes
  save('player', 40, 56);

  // --- Sword swing hitbox visual (28x10) ---
  reset();
  g.fillStyle(0xd7d7e0, 1); g.fillRect(0, 3, 22, 4);
  g.fillStyle(0x8a5a2b, 1); g.fillRect(20, 0, 8, 10);
  save('sword', 28, 10);

  // --- Thrown item: acorn (16x16) ---
  reset();
  g.fillStyle(0x8a5a2b, 1); g.fillEllipse(8, 5, 14, 8);
  g.fillStyle(0xd8a24a, 1); g.fillEllipse(8, 11, 12, 9);
  save('acorn', 16, 16);

  // --- Ground tile (64x64) ---
  reset();
  g.fillStyle(0x6b4a2b, 1); g.fillRect(0, 0, 64, 64);
  g.fillStyle(0x4f8a3d, 1); g.fillRect(0, 0, 64, 14);
  g.fillStyle(0x3f6f30, 1); g.fillRect(0, 10, 64, 6);
  save('ground', 64, 64);

  // --- Platform tile (64x20) ---
  reset();
  g.fillStyle(0x8a5a2b, 1); g.fillRect(0, 0, 64, 20);
  g.fillStyle(0x6b4321, 1); g.fillRect(0, 0, 64, 5);
  save('platform', 64, 20);

  // --- Spike (32x32) ---
  reset();
  g.fillStyle(0x9aa0aa, 1);
  for (var i = 0; i < 3; i++) {
    g.fillTriangle(i * 11, 32, i * 11 + 5, 6, i * 11 + 11, 32);
  }
  save('spike', 32, 32);

  // --- Spring (32x24) ---
  reset();
  g.fillStyle(0xcf3b3b, 1); g.fillRect(2, 14, 28, 10);
  g.fillStyle(0xe8e8e8, 1); g.fillRect(2, 8, 28, 6);
  save('spring', 32, 24);

  // --- Crate (40x40) ---
  reset();
  g.fillStyle(0x9a6b34, 1); g.fillRect(0, 0, 40, 40);
  g.lineStyle(3, 0x6b4321, 1);
  g.strokeRect(2, 2, 36, 36);
  g.lineBetween(0, 0, 40, 40); g.lineBetween(40, 0, 0, 40);
  save('crate', 40, 40);

  // --- Coin (20x20) ---
  reset();
  g.fillStyle(0xffd23f, 1); g.fillCircle(10, 10, 9);
  g.fillStyle(0xe6a800, 1); g.fillCircle(10, 10, 5);
  save('coin', 20, 20);

  // --- Portal (50x70) ---
  reset();
  g.fillStyle(0x2f8f5a, 1); g.fillEllipse(25, 35, 40, 60);
  g.fillStyle(0x8be3c0, 1); g.fillEllipse(25, 35, 26, 46);
  g.fillStyle(0xd8fff0, 1); g.fillEllipse(25, 35, 12, 26);
  save('portal', 50, 70);

  // --- Flag (40x90) ---
  reset();
  g.fillStyle(0x8a8a8a, 1); g.fillRect(18, 0, 4, 90);
  g.fillStyle(0x2fa84f, 1); g.fillTriangle(22, 4, 22, 34, 40, 19);
  save('flag', 40, 90);

  // --- Signpost (32x40, decorative) ---
  reset();
  g.fillStyle(0x8a5a2b, 1); g.fillRect(14, 10, 4, 30);
  g.fillStyle(0xd8b26a, 1); g.fillRect(0, 0, 32, 14);
  save('signpost', 32, 40);

  // --- Bug enemy (32x24) ---
  reset();
  g.fillStyle(0xcf3b3b, 1); g.fillEllipse(16, 12, 30, 18);
  g.fillStyle(0x222222, 1); g.fillEllipse(16, 8, 26, 4);
  g.fillCircle(9, 6, 2); g.fillCircle(23, 6, 2);
  save('bug', 32, 24);

  // --- Mini-boss (90x90) ---
  reset();
  g.fillStyle(0x6b2f9e, 1); g.fillCircle(45, 48, 40);
  g.fillStyle(0x2b1140, 1); g.fillCircle(30, 40, 8); g.fillCircle(60, 40, 8);
  g.fillStyle(0xffffff, 1); g.fillCircle(30, 40, 3); g.fillCircle(60, 40, 3);
  g.fillStyle(0x2b1140, 1); g.fillRect(24, 62, 42, 6);
  save('boss', 90, 90);

  // --- Boss projectile (14x14) ---
  reset();
  g.fillStyle(0x9a2fd6, 1); g.fillCircle(7, 7, 7);
  save('bossBolt', 14, 14);

  // --- Heart icon (24x22) ---
  reset();
  g.fillStyle(0xe0344a, 1);
  g.fillCircle(7, 8, 7); g.fillCircle(17, 8, 7);
  g.fillTriangle(1, 10, 23, 10, 12, 22);
  save('heart', 24, 22);
  reset();
  g.fillStyle(0x3a3a3a, 1);
  g.fillCircle(7, 8, 7); g.fillCircle(17, 8, 7);
  g.fillTriangle(1, 10, 23, 10, 12, 22);
  save('heartEmpty', 24, 22);

  // --- Sky background layers (wide, opaque) ---
  reset();
  g.fillStyle(0x9fd8ef, 1);
  g.fillRect(0, 0, 1600, 540);
  g.fillStyle(0xffffff, 0.8);
  for (var c = 0; c < 6; c++) g.fillEllipse(120 + c * 260, 70 + (c % 3) * 30, 90, 34);
  save('bgFar', 1600, 540);

  reset();
  g.fillStyle(0x3f8f5a, 0.85);
  for (var h = 0; h < 8; h++) {
    g.fillEllipse(80 + h * 220, 470, 260, 140);
  }
  save('bgMid', 1600, 540);

  g.destroy();
}
