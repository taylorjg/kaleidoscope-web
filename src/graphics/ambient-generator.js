/** Auto palette / seed shift timing (seconds). */
export const AUTO_SEED_MIN_SECONDS = 15;
export const AUTO_SEED_MAX_SECONDS = 30;

/**
 * Manages ambient auto-seed shifts on a timer.
 */
export class AmbientGenerator {
  constructor() {
    this._autoSeed = Math.random() * 10000;
    this._nextShiftAt = this._scheduleNext();
  }

  _scheduleNext() {
    const span = AUTO_SEED_MAX_SECONDS - AUTO_SEED_MIN_SECONDS;
    return (
      performance.now() / 1000 + AUTO_SEED_MIN_SECONDS + Math.random() * span
    );
  }

  /** @param {number} nowSeconds */
  tick(nowSeconds) {
    if (nowSeconds >= this._nextShiftAt) {
      this._autoSeed = Math.random() * 10000;
      this._nextShiftAt = this._scheduleNext();
    }
    return this._autoSeed;
  }

  reseed() {
    this._autoSeed = Math.random() * 10000;
    this._nextShiftAt = this._scheduleNext();
    return this._autoSeed;
  }

  get autoSeed() {
    return this._autoSeed;
  }
}
