# Custom Kid-Made Art via ChatGPT

The game currently runs on simple procedurally-drawn placeholder shapes
(see `src/placeholderArt.js`) so it's playable right away. This doc is the
spec for replacing them with real art the kids design and you generate
with ChatGPT.

Two practical realities shape this spec:

- ChatGPT's image generator outputs fixed image sizes and can't reliably
  lay out a precise multi-frame animation grid — so instead of asking for
  "sprite sheets," generate **one separate image per pose/object**, all in
  the same consistent style. Whoever integrates the art resizes/crops/
  assembles them into the game's textures — you don't need to hit exact
  pixel dimensions yourself.
- ChatGPT often can't produce true alpha transparency reliably. So for
  anything that sits on top of the game background (character, enemies,
  objects), ask for a **flat, solid, single background color that doesn't
  appear anywhere else in the art** (bright magenta `#FF00FF`) — that
  color gets keyed out to transparency during integration. Full-scene
  backgrounds don't need this; they're opaque by design.

## Step 0 — Lock a style anchor (do this once, first)

Paste this, look at the result with the kids, and iterate until you like
it — this exact image becomes the style reference for everything else:

> "Create a single reference image establishing an art style for a kids'
> 2D side-scrolling platformer game: flat cel-shaded illustration, bold
> clean black outlines, warm cheerful storybook colors (moss green, warm
> browns, sky blue, golden-yellow highlights), viewed straight from the
> side like a classic platformer (no 3D perspective, no isometric angle).
> Show our hero character standing in a simple heroic pose in the center,
> full body visible, on a flat solid magenta background (#FF00FF, no
> texture, no shadow gradients on the background itself). [Describe the
> character here — the kids' design, e.g. 'a kid in a red cap and blue
> overalls, holding a small wooden sword']."

Once you're happy with it, **reuse that same ChatGPT conversation** (or
attach the resulting image as a reference) for every prompt below, adding
"same exact character design and art style as the reference image" to
each one — that's what keeps everything looking consistent.

## Step 1 — Player character poses (`sprites/player_*.png`)

Generate each as its own image, same character/style/scale as the anchor,
solid magenta `#FF00FF` background, full body centered, same "camera"
distance in every image:

1. `player_idle` — standing pose, relaxed.
2. `player_run_1` / `player_run_2` — two mid-stride running poses (legs in opposite positions).
3. `player_jump` — mid-air jump pose.
4. `player_sword` — mid-swing pose with the sword/weapon extended forward.
5. `player_throw` — arm cocked back about to throw the item.
6. `player_hurt` — recoiling/flinching pose (damage-taken animation).

Prompt template (repeat per pose):

> "Same exact character design and art style as the reference image:
> [pose description, e.g. 'the character mid-jump, arms out for balance,
> legs bent upward']. Full body, centered, flat solid magenta (#FF00FF)
> background, no shadow on the ground, same scale and side-view camera
> angle as the reference."

## Step 2 — Enemies & bosses (`sprites/bug_*.png`, `sprites/boss_*.png`)

- `bug_enemy_1`, `bug_enemy_2` — two walk-cycle poses of the regular "bad bug" enemy (kids design what it looks like — ladybug, beetle, whatever they want).
- `bug_enemy_hurt` — a squashed/damaged pose (played briefly when defeated).
- `boss_L2_idle`, `boss_L2_attack`, `boss_L2_hurt` — the Level 2 mini-boss ("Bramble Brute"), noticeably larger/more imposing than the regular bugs.
- Later, for levels 4/6/8/10: `boss_L4_*`, `boss_L6_*`, `boss_L8_*`, and `boss_final_*` (maybe an extra `boss_final_phase2_*` for when the final boss powers up).

Prompt template:

> "Same art style as the reference image (flat cel-shaded, bold outlines,
> warm storybook colors, side-view): [creature description, e.g. 'a
> grumpy round beetle enemy with tiny angry eyebrows, walking, one leg
> forward']. Full body, centered, flat solid magenta (#FF00FF) background,
> no ground shadow."

## Step 3 — Tiles & objects (one square image each)

- `tile_ground`, `tile_platform` — ground block / floating platform block.
- `tile_moving_platform` — the floating panel that patrols back and forth over the wide spike beds (currently the same wood-plank look as `tile_platform` with a light blue tint — give it its own distinct look, e.g. a glowing rune-carved stone slab or a leaf raft, so it reads as "this one moves" at a glance).
- `spike`, `spring`, `crate`, `coin`, `portal`, `flag`, `signpost`.
- `throw_item` — the world-specific thrown item (acorn/berry — kids' choice).
- `sword_icon`, `throw_icon`, `heart_icon` — small HUD icons.

Prompt template:

> "Same art style as the reference image: a single [object, e.g. 'wooden
> spring-loaded bounce pad'] game object, viewed from the side, centered,
> flat solid magenta (#FF00FF) background, no shadow, simple game-icon
> composition."

## Step 4 — Backgrounds (wide, opaque, no magenta needed)

Full illustrated scenes, one per level, generated as wide landscape images:

- `bg_level1_far` / `bg_level1_mid` — Garden Path background (two depth layers for parallax).
- `bg_level2_far` / `bg_level2_mid` — Bramble Bridge background (waterfall, bridge, distant floating village).

Prompt template:

> "Same art style as the reference image: a wide side-scrolling platformer
> background illustration for a level called '[level name]', [describe
> scene], no characters or UI, painted as a continuous wide landscape
> suitable for horizontal scrolling."

## Handing it off

Send the generated PNGs (any reasonable size, no need to crop precisely)
named to match the asset names above. Integration replaces the
placeholder textures in `src/placeholderArt.js` with real image loads in
`BootScene.preload()` — no other code changes needed.
