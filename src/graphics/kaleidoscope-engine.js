import { toEngineSettings } from "@app/settings/to-engine-settings.js";
import { DEFAULT_URL_SETTINGS } from "@app/settings/defaults.js";
import { AmbientGenerator } from "./ambient-generator.js";
import { CameraSource } from "./camera-source.js";
import { initWebGL } from "./webgl/context.js";
import {
  createRenderer,
  disposeRenderer,
  drawFrame,
  uploadVideoFrame,
} from "./webgl/renderer.js";

const defaultEngineSettings = () => toEngineSettings(DEFAULT_URL_SETTINGS);

/**
 * Pure WebGL kaleidoscope engine — no React imports.
 */
export class KaleidoscopeEngine {
  /**
   * @param {HTMLElement} container
   * @param {{ onStatus?: (status: { type: string, error?: unknown }) => void }} [options]
   */
  constructor(container, { onStatus } = {}) {
    this._container = container;
    this._onStatus = onStatus ?? (() => {});
    this._settings = defaultEngineSettings();
    this._settingsRef = { current: this._settings };
    this._disposed = false;
    this._rafId = null;
    this._startTime = performance.now();

    this._canvas = document.createElement("canvas");
    this._canvas.style.display = "block";
    this._canvas.style.width = "100%";
    this._canvas.style.height = "100%";
    container.appendChild(this._canvas);

    this._gl = initWebGL(this._canvas);
    if (!this._gl) {
      this._onStatus({ type: "webgl-unavailable" });
      return;
    }

    this._renderer = createRenderer(this._gl);
    if (!this._renderer) {
      this._onStatus({ type: "webgl-unavailable" });
      return;
    }

    this._ambient = new AmbientGenerator();
    this._camera = new CameraSource({ onStatus: this._onStatus });
    this._lastMode = this._settings.mode;

    this._resizeObserver = new ResizeObserver(() => this._handleResize());
    this._resizeObserver.observe(container);
    this._handleResize();

    this._onStatus({ type: "ready" });
    this._loop = this._loop.bind(this);
    this._rafId = requestAnimationFrame(this._loop);

    if (this._settings.mode === "camera") {
      this._camera.start();
    }
  }

  get settingsRef() {
    return this._settingsRef;
  }

  /** @param {ReturnType<typeof toEngineSettings>} settings */
  setSettings(settings) {
    this._settings = settings;
    this._settingsRef.current = settings;

    if (settings.mode !== this._lastMode) {
      this._lastMode = settings.mode;
      if (settings.mode === "camera") {
        this._camera.start();
      } else {
        this._camera.stop();
      }
    }
  }

  reseed() {
    const seed = Math.floor(Math.random() * 100000);
    this._ambient.reseed();
    this._settings = {
      ...this._settings,
      ambient: { ...this._settings.ambient, seed },
    };
    this._settingsRef.current = this._settings;
    return seed;
  }

  snapshot() {
    return this._canvas.toDataURL("image/png");
  }

  _handleResize() {
    if (!this._gl) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(this._container.clientWidth * dpr);
    const h = Math.floor(this._container.clientHeight * dpr);
    if (w <= 0 || h <= 0) return;
    this._canvas.width = w;
    this._canvas.height = h;
    this._gl.viewport(0, 0, w, h);
  }

  _loop() {
    if (this._disposed || !this._gl || !this._renderer) return;

    const settings = this._settingsRef.current;
    const time = (performance.now() - this._startTime) / 1000;
    const autoSeed = this._ambient.tick(time);

    let hasCamera = false;
    if (settings.mode === "camera" && this._camera.isActive) {
      hasCamera = uploadVideoFrame(
        this._gl,
        this._renderer.cameraTexture,
        this._camera.video
      );
    }

    drawFrame(
      this._gl,
      this._renderer.program,
      this._renderer.vao,
      this._renderer.uniforms,
      settings,
      time,
      autoSeed,
      this._renderer.cameraTexture,
      hasCamera
    );

    this._rafId = requestAnimationFrame(this._loop);
  }

  dispose() {
    this._disposed = true;
    if (this._rafId != null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._resizeObserver?.disconnect();
    this._camera?.dispose();
    if (this._gl && this._renderer) {
      disposeRenderer(this._gl, this._renderer);
    }
    this._canvas?.remove();
    const ext = this._gl?.getExtension("WEBGL_lose_context");
    ext?.loseContext();
    this._gl = null;
    this._renderer = null;
  }
}
