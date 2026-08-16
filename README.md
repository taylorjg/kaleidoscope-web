# Kaleidoscope Web

Browser kaleidoscope with **generated** (procedural stained glass) and **camera** (webcam) modes. Built as a proving ground for a clean React ↔ WebGL bridge.

Live demo: https://taylorjg.github.io/kaleidoscope-web/

## Features

- Generated mode — stained-glass procedural patterns, auto palette shifts, tunable sliders
- Camera mode — live webcam through kaleidoscope symmetry
- Shareable URLs — settings sync to query string via [nuqs](https://nuqs.dev)
- Snapshot — download PNG
- Fullscreen support

## URL parameters

| Param | Example | Description |
|-------|---------|-------------|
| `mode` | `generated` | `generated` or `camera` |
| `segments` | `8` | 3–12 |
| `mirror` | `1` | Mirror symmetry |
| `rotation` | `25` | Rotation speed (0–100) |
| `motion` | `50` | Pattern motion (0–100) |
| `detail` | `10` | Cell detail (0–100) |
| `seed` | `42` | Pattern seed |
| `controls` | `0` | Hide control panel |
| `fullscreen` | `1` | Enter fullscreen on load |

Example: `/kaleidoscope-web/?mode=generated&segments=8&motion=50&controls=0`

## Development

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

## Deploy (GitHub Pages)

```bash
npm run deploy
```

## Architecture

See [src/graphics/README.md](src/graphics/README.md) for the React ↔ WebGL bridge pattern.
