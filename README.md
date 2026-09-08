# Kid Platformer Adventure

A browser/tablet 2D side-scrolling platformer, built with [Phaser 3](https://phaser.io)
(vendored locally in `vendor/phaser.min.js` — no internet connection needed
to play, no build step, no npm install).

## Play it

From this `game/` folder, serve it with any static file server (opening
`index.html` directly with a double-click also works in most browsers):

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/` in a browser, or on a tablet on the
same network, `http://<your-computer's-ip>:8000/`.

## Controls

- **Desktop:** Arrow keys / WASD to move, Space or Up to jump, `X` to
  swing the sword, `C` to throw.
- **Tablet/touch:** on-screen buttons (bottom-left move, bottom-right
  jump/sword/throw).

## What's here (World 1 MVP)

- Full engine: movement/jumping, coins, spikes, springs, crates, patrol
  enemies, a mini-boss with a health bar and attack pattern, player HP/
  lives, sword + thrown-item combat, stomp damage, and a portal/flag
  level-goal system.
- **Level 1 — The Garden Path** (normal level) and **Level 2 — Bramble
  Bridge** (mini-boss "Bramble Brute") are fully built and playable.
- Placeholder art everywhere (`src/placeholderArt.js`) so it's playable
  today. See `assets/README.md` for the spec to replace it with the kids'
  own ChatGPT-generated art.

## Roadmap

The plan is 10 levels total: odd levels are normal, even levels have a
mini-boss, and level 10 is the final boss. Levels 3–10 aren't built yet —
`src/levels/levelsManifest.js` has the commented-out slots ready, and
adding a new level is just: create a `levelN.js` file following the same
data shape as `level1.js`/`level2.js`, add a boss config (for even
levels) following `level2.js`'s `boss` block, and uncomment its line in
the manifest. No engine changes needed.
