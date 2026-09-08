// Shared game state that survives between scenes (score, lives, current level).
var GameState = {
  score: 0,
  lives: 3,
  currentLevelIndex: 0,

  reset: function () {
    this.score = 0;
    this.lives = 3;
    this.currentLevelIndex = 0;
  }
};
