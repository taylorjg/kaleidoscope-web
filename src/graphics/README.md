# Graphics layer — React ↔ WebGL bridge

This folder contains **zero React imports**. The kaleidoscope renderer is a plain JavaScript class that could run outside React or be unit-tested in isolation.

## Architecture

```
React (App.jsx)
  └── useKaleidoscopeSettings()   ← nuqs URL sync (see hooks/)
  └── <GraphicsCanvas ref={…} />
        └── useGraphicsEngine()     ← mount / dispose / settings sync
              └── KaleidoscopeEngine ← WebGL, rAF, camera, shaders
```

### KaleidoscopeEngine

| Method | Purpose |
|--------|---------|
| `constructor(container, { onStatus })` | Append canvas, init WebGL, start rAF |
| `setSettings(settings)` | Merge settings; start/stop camera on mode change |
| `snapshot()` | PNG data URL |
| `reseed()` | New generative pattern seed |
| `dispose()` | Cancel rAF, stop camera, remove canvas, lose GL context |

### useGraphicsEngine

- Creates engine in `useEffect`, calls `dispose()` on cleanup (StrictMode-safe).
- Mirrors `settings` via `setSettings` when React state changes.
- Exposes `snapshot` / `reseed` through ref (`useImperativeHandle` on `GraphicsCanvas`).

### Status events (graphics → React)

Only async events that UI must react to:

- `ready` — WebGL initialised
- `camera-ready` / `camera-denied` / `camera-unavailable` / `camera-stopped`
- `webgl-unavailable`

## URL sync — why nuqs

We chose **[nuqs](https://nuqs.dev)** over [use-param-sync](https://www.npmjs.com/package/use-param-sync):

- **Per-control debounce** — sliders use `debounce(250)`; mode/segments update immediately
- **`clearOnDefault`** — clean shareable URLs
- **Mature ecosystem** — adapters for Next.js, React Router, etc. (useful for retrofitting [rubiks-cube](../../rubiks-cube))

`use-param-sync` remains a good alternative for simpler object-shaped state with global debounce.

References:

- [nuqs React SPA adapter](https://nuqs.dev/docs/adapters)
- [nuqs options (debounce, replaceState)](https://nuqs.dev/docs/options)
- [Query string state sync (frontend-routing.com)](https://www.frontend-routing.com/history-api-state-management/query-string-state-sync/)

## Retrofit guide

To apply this pattern elsewhere (e.g. FractalsWebGL, solid-light-works):

1. Extract graphics into a `*Engine` class with `dispose()`.
2. Wrap with `useGraphicsEngine({ settings, onStatus })` + ref container (no `#canvas` in HTML).
3. Keep URL / UI state in React; pass a plain settings object into the engine.
4. Use `onStatus` only for async feedback — not per-frame events.
