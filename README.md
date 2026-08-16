[![CI/CD](https://github.com/taylorjg/kaleidoscope-web/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/taylorjg/kaleidoscope-web/actions/workflows/ci-cd.yml)

# Kaleidoscope Web

Browser kaleidoscope with **generative** (procedural stained glass) and **camera** (webcam) modes. Built as a proving ground for a clean React ↔ WebGL bridge.

Live demo: https://taylorjg.github.io/kaleidoscope-web/

## Features

- Generative mode — stained-glass procedural patterns, auto palette shifts, tunable sliders; tap the screen for a new pattern
- Camera mode — live webcam through kaleidoscope symmetry
- Shareable URLs — settings sync to query string via [nuqs](https://nuqs.dev)
- Snapshot — download PNG
- Fullscreen support

## URL parameters

| Param | Example | Description |
|-------|---------|-------------|
| `mode` | `generative` | `generative` or `camera` |
| `segments` | `8` | 3–12 |
| `mirror` | `1` | Mirror symmetry |
| `rotation` | `25` | Rotation speed (0–100) |
| `motion` | `50` | Pattern motion (0–100) |
| `detail` | `10` | Cell detail (0–100) |
| `seed` | `42` | Pattern seed |
| `controls` | `0` | Hide control panel |
| `fullscreen` | `1` | Enter fullscreen on load |

Example: `/kaleidoscope-web/?mode=generative&segments=8&motion=50&controls=0`

## Development

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

## Deploy (GitHub Pages)

Pushing a version tag (e.g. `v0.0.2`) triggers CI to build and deploy to GitHub Pages. You can also deploy manually:

```bash
npm run deploy
```

## Architecture

See [src/graphics/README.md](src/graphics/README.md) for the React ↔ WebGL bridge pattern.
