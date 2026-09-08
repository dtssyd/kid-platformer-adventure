// Level 2: "Bramble Bridge" — gaps crossed by a bridge platform, a longer
// spike row, an extra bug, and a mini-boss ("Bramble Brute") guarding the
// flag. The flag only completes the level once the boss is defeated
// (see PlayScene's goal-overlap check).
(function () {
  var GROUND_Y = 480;

  window.LEVEL_2 = {
    key: 'level2',
    name: 'Bramble Bridge',
    width: 2650,
    height: 900, // taller than the playable strip so wide/tall viewports never see blank space below the ground
    groundY: GROUND_Y, // used to detect "fell into a pit" promptly, independent of the taller background height above
    bgColor: 0x7fd0ce,
    playerStart: { x: 80, y: 400 },

    ground: [
      { x1: -100, x2: 500, y: GROUND_Y },
      { x1: 620, x2: 1000, y: GROUND_Y },
      { x1: 1140, x2: 1700, y: GROUND_Y },
      { x1: 1800, x2: 2650, y: GROUND_Y }
    ],
    platforms: [
      { x1: 1000, x2: 1140, y: 460 }
    ],

    spikes: [
      // A long spike bed crossed via two independently-patrolling platforms
      // — you have to watch both and time the jump between them, not just
      // ride one straight across.
      { x: 1300, y: 464 }, { x: 1332, y: 464 }, { x: 1364, y: 464 },
      { x: 1396, y: 464 }, { x: 1428, y: 464 }, { x: 1460, y: 464 },
      { x: 1492, y: 464 }, { x: 1524, y: 464 }, { x: 1556, y: 464 }, { x: 1588, y: 464 }
    ],
    movingPlatforms: [
      { x: 1280, y: 390, minX: 1280, maxX: 1500, speed: 75, startDirection: 1 },
      { x: 1640, y: 390, minX: 1420, maxX: 1640, speed: 60, startDirection: -1 }
    ],
    springs: [],
    crates: [
      { x: 700, y: 460 }
    ],
    signposts: [
      { x: 120, y: 460 }
    ],
    coins: [
      { x: 150, y: 420 }, { x: 190, y: 400 }, { x: 230, y: 420 },
      { x: 1000, y: 340 }, { x: 1040, y: 300 }, { x: 1080, y: 340 },
      { x: 1900, y: 400 }, { x: 1940, y: 380 }
    ],
    throwPickups: [
      { x: 250, y: 420 }, { x: 900, y: 420 }, { x: 2050, y: 420 }, { x: 2150, y: 420 }
    ],
    enemies: [
      { x: 850, y: 468, minX: 780, maxX: 950, hp: 1 },
      { x: 1850, y: 468, minX: 1800, maxX: 1950, hp: 1 }
    ],
    boss: {
      name: 'Bramble Brute',
      x: 2350, y: 390, hp: 6,
      minX: 2250, maxX: 2500,
      walkSpeed: 50, chargeSpeed: 230, contactDamage: 1,
      phase2AtFraction: 0.5
    },
    goal: { type: 'flag', x: 2580, y: 435 }
  };
})();
