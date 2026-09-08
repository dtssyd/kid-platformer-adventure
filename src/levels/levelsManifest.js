// Ordered list of levels the game plays through. Levels 3-10 follow the
// same pattern as 1 and 2 (odd = normal, even = mini-boss, 10 = final
// boss with a second phase) and can be added here once their level data
// files exist — no engine changes required.
window.LEVEL_MANIFEST = [
  LEVEL_1,
  LEVEL_2
  // LEVEL_3,  // normal level, same template as LEVEL_1
  // LEVEL_4,  // mini-boss level, same template as LEVEL_2
  // LEVEL_5,  // normal
  // LEVEL_6,  // mini-boss
  // LEVEL_7,  // normal
  // LEVEL_8,  // mini-boss
  // LEVEL_9,  // normal
  // LEVEL_10  // final boss: give its `boss` config a higher hp and set
  //           // phase2AtFraction for a tougher second phase
];
