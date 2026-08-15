const TAU = Math.PI * 2;

/**
 * Fold an angle into a kaleidoscope segment (mirrors shader logic).
 * @param {number} angle - radians
 * @param {number} segments - wedge count
 * @param {boolean} mirror - mirror within segment
 * @returns {number} folded angle in [0, segmentAngle]
 */
export const foldAngle = (angle, segments, mirror) => {
  const segmentAngle = TAU / segments;
  let a = ((angle % TAU) + TAU) % TAU;
  a = a % segmentAngle;
  if (mirror) {
    a = Math.abs(a - segmentAngle * 0.5);
  }
  return a;
};

/**
 * Apply kaleidoscope fold to normalised UV coords (0–1, centre at 0.5).
 * @param {number} x
 * @param {number} y
 * @param {number} segments
 * @param {boolean} mirror
 * @param {number} [rotation=0] - extra rotation in radians
 * @returns {{ x: number, y: number, r: number }}
 */
export const foldUv = (x, y, segments, mirror, rotation = 0) => {
  const px = x - 0.5;
  const py = y - 0.5;
  const r = Math.hypot(px, py);
  const angle = Math.atan2(py, px) + rotation;
  const folded = foldAngle(angle, segments, mirror);
  return {
    x: Math.cos(folded) * r + 0.5,
    y: Math.sin(folded) * r + 0.5,
    r,
  };
};
