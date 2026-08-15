# Kaleidoscope Web

Browser kaleidoscope with **ambient** (procedural) and **camera** (webcam) modes. Built as a proving ground for a clean React ↔ WebGL bridge.

Live demo: https://taylorjg.github.io/kaleidoscope-web/

## Features

- Ambient mode — flowing procedural patterns, auto palette shifts, tunable sliders
- Camera mode — live webcam through kaleidoscope symmetry
- Shareable URLs — settings sync to query string via [nuqs](https://nuqs.dev)
- Snapshot — download PNG
- Fullscreen support

## URL parameters

| Param | Example | Description |
|-------|---------|-------------|
| `mode` | `ambient` | `ambient` or `camera` |
| `segments` | `8` | 3–12 |
| `mirror` | `1` | Mirror symmetry |
| `rotation` | `40` | Rotation speed (0–100) |
| `flow` | `60` | Ambient flow speed |
| `colourShift` | `20` | Ambient hue shift |
| `complexity` | `80` | Ambient noise scale |
| `saturation` | `50` | Ambient saturation |
| `seed` | `42` | Ambient pattern seed |
| `controls` | `0` | Hide control panel |
| `fullscreen` | `1` | Enter fullscreen on load |

Example: `/kaleidoscope-web/?mode=ambient&segments=8&flow=60&controls=0`

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
