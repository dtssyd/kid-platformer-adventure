// Level 1: "The Garden Path" — intro level. Continuous ground with spike
// clusters to jump over, a spring, a crate, two patrolling bugs, coins,
// and a portal goal. All coordinates are world pixels; GROUND_Y (480) is
// the top surface of the ground tiles.
(function () {
  var GROUND_Y = 480;

  window.LEVEL_1 = {
    key: 'level1',
    name: 'The Garden Path',
    width: 2450,
    height: 900, // taller than the playable strip so wide/tall viewports never see blank space below the ground
    bgColor: 0x9fd8ef,
    playerStart: { x: 80, y: 400 },

    ground: [
      { x1: -100, x2: 2500, y: GROUND_Y }
    ],
    platforms: [
      { x1: 1500, x2: 1700, y: 330 }
    ],

    spikes: [
      { x: 440, y: 464 }, { x: 472, y: 464 }, { x: 504, y: 464 },
      { x: 1000, y: 464 }, { x: 1032, y: 464 }, { x: 1064, y: 464 }, { x: 1096, y: 464 }
    ],
    springs: [
      { x: 1300, y: 468 }
    ],
    crates: [
      { x: 1800, y: 460 }
    ],
    signposts: [
      { x: 120, y: 460 }, { x: 1900, y: 460 }
    ],
    coins: [
      { x: 200, y: 420 }, { x: 240, y: 400 }, { x: 280, y: 420 },
      { x: 456, y: 340 }, { x: 488, y: 300 }, { x: 520, y: 340 },
      { x: 1016, y: 340 }, { x: 1048, y: 300 }, { x: 1080, y: 340 },
      { x: 1300, y: 210 }, { x: 1340, y: 170 }
    ],
    throwPickups: [
      { x: 600, y: 420 }, { x: 1800, y: 400 }, { x: 2150, y: 420 }
    ],
    enemies: [
      { x: 750, y: 468, minX: 680, maxX: 850, hp: 1 },
      { x: 1620, y: 318, minX: 1550, maxX: 1680, hp: 1 }
    ],
    boss: null,
    goal: { type: 'portal', x: 2380, y: 445 }
  };
})();
