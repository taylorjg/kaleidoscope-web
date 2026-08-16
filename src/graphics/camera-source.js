/**
 * Webcam lifecycle — getUserMedia, visibility pause, cleanup.
 */
export class CameraSource {
  /**
   * @param {{ onStatus: (status: { type: string, error?: unknown, canFlip?: boolean, facingMode?: string }) => void }} options
   */
  constructor({ onStatus }) {
    this._onStatus = onStatus;
    this._video = document.createElement("video");
    this._video.setAttribute("playsinline", "");
    this._video.muted = true;
    this._stream = null;
    this._active = false;
    this._facingMode = "user";
    this._canFlip = false;

    this._onVisibilityChange = () => {
      if (!this._stream) return;
      const track = this._stream.getVideoTracks()[0];
      if (!track) return;
      track.enabled = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", this._onVisibilityChange);
  }

  get video() {
    return this._video;
  }

  get isActive() {
    return this._active;
  }

  get canFlip() {
    return this._canFlip;
  }

  get facingMode() {
    return this._facingMode;
  }

  async _detectCanFlip() {
    if (!navigator.mediaDevices?.enumerateDevices) {
      this._canFlip = false;
      return;
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videos = devices.filter((device) => device.kind === "videoinput");

    if (videos.length >= 2) {
      this._canFlip = true;
      return;
    }

    const facingSupported =
      navigator.mediaDevices.getSupportedConstraints?.().facingMode ?? false;
    const likelyMobile = window.matchMedia("(pointer: coarse)").matches;

    this._canFlip = facingSupported && likelyMobile && videos.length >= 1;
  }

  async _acquireStream() {
    if (!navigator.mediaDevices?.getUserMedia) {
      this._onStatus({ type: "camera-unavailable" });
      return false;
    }

    if (this._stream) {
      this._stream.getTracks().forEach((track) => track.stop());
      this._stream = null;
    }

    try {
      this._stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this._facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      this._video.srcObject = this._stream;
      await this._video.play();
      this._active = true;
      await this._detectCanFlip();
      this._onStatus({
        type: "camera-ready",
        canFlip: this._canFlip,
        facingMode: this._facingMode,
      });
      return true;
    } catch (error) {
      this._video.srcObject = null;
      this._active = false;
      this._onStatus({ type: "camera-denied", error });
      return false;
    }
  }

  async start() {
    if (this._active) return true;
    return this._acquireStream();
  }

  async flip() {
    if (!this._canFlip || !this._active) return false;

    const previous = this._facingMode;
    this._facingMode = previous === "user" ? "environment" : "user";

    if (await this._acquireStream()) return true;

    this._facingMode = previous;
    this._canFlip = false;
    await this._acquireStream();
    return false;
  }

  stop() {
    if (this._stream) {
      this._stream.getTracks().forEach((track) => track.stop());
      this._stream = null;
    }
    this._video.srcObject = null;
    this._active = false;
    this._canFlip = false;
    this._facingMode = "user";
    this._onStatus({ type: "camera-stopped" });
  }

  dispose() {
    this.stop();
    document.removeEventListener("visibilitychange", this._onVisibilityChange);
  }
}
