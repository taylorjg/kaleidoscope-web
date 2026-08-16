/** Auto palette shift timing (seconds). */
export const AUTO_SEED_MIN_SECONDS = 18;
export const AUTO_SEED_MAX_SECONDS = 32;

/**
 * Manages generated-mode auto-seed shifts on a timer.
 */
export class PatternGenerator {
  constructor() {
    this._autoSeed = Math.random() * 10000;
    this._nextShiftAt = this._scheduleNext(0);
  }

  /** @param {number} elapsedSeconds */
  _scheduleNext(elapsedSeconds) {
    const span = AUTO_SEED_MAX_SECONDS - AUTO_SEED_MIN_SECONDS;
    return elapsedSeconds + AUTO_SEED_MIN_SECONDS + Math.random() * span;
  }

  /** @param {number} elapsedSeconds */
  tick(elapsedSeconds) {
    if (elapsedSeconds >= this._nextShiftAt) {
      this._autoSeed = Math.random() * 10000;
      this._nextShiftAt = this._scheduleNext(elapsedSeconds);
    }
    return this._autoSeed;
  }

  reseed() {
    this._autoSeed = Math.random() * 10000;
    this._nextShiftAt = this._scheduleNext(0);
    return this._autoSeed;
  }

  get autoSeed() {
    return this._autoSeed;
  }
}
