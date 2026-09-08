// Responsive sizing: the canvas always fills the available landscape
// viewport 1:1 (no letterboxing), clamped so it doesn't get absurdly
// large on desktop monitors. Portrait phones/tablets get a "rotate your
// device" prompt instead (see index.html/style.css) rather than cramming
// a side-scroller into a tall narrow strip.
function computeGameSize() {
  var w = Math.min(window.innerWidth, 1280);
  var h = Math.min(window.innerHeight, 800);
  return { width: Math.max(320, w), height: Math.max(240, h) };
}

var initialSize = computeGameSize();

var config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: initialSize.width,
  height: initialSize.height,
  backgroundColor: '#9fd8ef',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  input: {
    activePointers: 3
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
      debug: false
    }
  },
  scene: [BootScene, MenuScene, PlayScene, GameOverScene]
};

window.game = new Phaser.Game(config);

var resizeTimer = null;
window.addEventListener('resize', function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    // Skip resizing while the #game-container is hidden behind the
    // rotate-to-landscape prompt (see style.css) — no point laying the
    // canvas out for a portrait size it isn't shown at.
    var container = document.getElementById('game-container');
    if (container && getComputedStyle(container).display === 'none') return;

    var size = computeGameSize();
    window.game.scale.resize(size.width, size.height);
  }, 80);
});
