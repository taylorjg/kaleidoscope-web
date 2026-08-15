/**
 * Webcam lifecycle — getUserMedia, visibility pause, cleanup.
 */
export class CameraSource {
  /**
   * @param {{ onStatus: (status: { type: string, error?: unknown }) => void }} options
   */
  constructor({ onStatus }) {
    this._onStatus = onStatus;
    this._video = document.createElement("video");
    this._video.setAttribute("playsinline", "");
    this._video.muted = true;
    this._stream = null;
    this._active = false;

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

  async start() {
    if (this._active) return true;

    if (!navigator.mediaDevices?.getUserMedia) {
      this._onStatus({ type: "camera-unavailable" });
      return false;
    }

    try {
      this._stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      this._video.srcObject = this._stream;
      await this._video.play();
      this._active = true;
      this._onStatus({ type: "camera-ready" });
      return true;
    } catch (error) {
      this._onStatus({ type: "camera-denied", error });
      return false;
    }
  }

  stop() {
    if (this._stream) {
      this._stream.getTracks().forEach((t) => t.stop());
      this._stream = null;
    }
    this._video.srcObject = null;
    this._active = false;
    this._onStatus({ type: "camera-stopped" });
  }

  dispose() {
    this.stop();
    document.removeEventListener("visibilitychange", this._onVisibilityChange);
  }
}
