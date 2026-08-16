export const VERTEX_SHADER = `#version 300 es
in vec2 aPosition;
out vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform vec2 uResolution;
uniform float uTime;
uniform float uMode;
uniform sampler2D uCameraTexture;
uniform float uHasCameraTexture;
uniform float uSegments;
uniform float uMirror;
uniform float uKaleidoRotation;
uniform float uFlow;
uniform float uComplexity;
uniform float uSeed;
uniform float uAutoSeed;

const float TAU = 6.28318530718;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec2 hash22(vec2 p) {
  float n = hash21(p);
  return vec2(n, hash21(p + n + 1.7));
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.05 + vec2(1.7);
    a *= 0.5;
  }
  return v;
}

vec2 kaleidoscopeUv(vec2 uv, float segments, float mirror, float rotation) {
  vec2 p = uv - 0.5;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  p.x *= aspect;
  float r = length(p);
  float a = atan(p.y, p.x) + rotation;
  float seg = TAU / max(segments, 1.0);
  a = mod(a, seg);
  if (mirror > 0.5) {
    a = abs(a - seg * 0.5);
  }
  p = vec2(cos(a), sin(a)) * r;
  p.x /= aspect;
  return p + 0.5;
}

vec3 hsl2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
}

vec4 voronoiLayer(vec2 uv, float t, vec2 seedOff) {
  vec2 n = floor(uv);
  vec2 f = fract(uv);
  float f1 = 8.0;
  float f2 = 8.0;
  vec2 cell = vec2(0.0);

  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash22(n + g + seedOff);
      o = 0.5 + 0.38 * sin(t + TAU * o);
      vec2 r = g + o - f;
      float d = dot(r, r);
      if (d < f1) {
        f2 = f1;
        f1 = d;
        cell = n + g;
      } else if (d < f2) {
        f2 = d;
      }
    }
  }

  float edge = sqrt(f2) - sqrt(f1);
  return vec4(sqrt(f1), edge, cell);
}

vec3 generativeColor(vec2 uv) {
  float flow = uFlow / 100.0;
  float detail = mix(2.8, 8.5, uComplexity / 100.0);
  float t = uTime * (0.04 + flow * 0.12);
  vec2 seedOff = vec2(uSeed * 0.0013, uAutoSeed * 0.0011);

  vec2 p = (uv - 0.5) * 2.0;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  p.x *= aspect;
  float r = length(p);

  vec2 warp = vec2(
    fbm(p * 1.15 + seedOff + t * 0.08),
    fbm(p * 1.15 + seedOff + vec2(4.2) - t * 0.06)
  ) - 0.5;
  p += warp * (0.12 + flow * 0.18);

  vec2 q = p * detail;

  vec4 v1 = voronoiLayer(q, t, seedOff);
  vec4 v2 = voronoiLayer(q * 1.85 + 3.1, t * 0.7, seedOff + 9.2);

  float edge = min(v1.y, v2.y * 0.85);
  float cellDist = v1.x;
  float cellHash = hash21(v1.zw + seedOff);

  float radialHue = mix(0.06, 0.58, smoothstep(0.0, 0.55, r));
  radialHue += mix(0.0, 0.12, smoothstep(0.55, 1.0, r));
  float hue = fract(
    cellHash * 0.42 +
    radialHue +
    hash21(v2.zw) * 0.08 +
    r * 0.08
  );

  float cellGlow = 1.0 - smoothstep(0.0, 0.42, cellDist);
  cellGlow = pow(cellGlow, 1.35);
  float innerBloom = smoothstep(0.15, 0.0, cellDist);

  float light = 0.34 + cellGlow * 0.4 + innerBloom * 0.18;
  light += fbm(q * 0.6 + cellHash) * 0.08;

  vec3 glass = hsl2rgb(vec3(hue, 1.0, clamp(light, 0.0, 1.0)));

  float leadW = mix(0.018, 0.045, 1.0 - uComplexity / 100.0);
  float lead = 1.0 - smoothstep(0.0, leadW, edge);
  vec3 col = mix(glass, vec3(0.012, 0.01, 0.018), lead * 0.92);

  float sparkle = pow(hash21(floor(q * 16.0) + v1.zw), 28.0) * cellGlow;
  col += vec3(1.0) * sparkle * 0.55;

  col += glass * cellGlow * 0.22;
  col = pow(max(col, 0.0), vec3(0.92));

  float vignette = 1.0 - pow(r * 0.95, 2.2) * 0.38;
  col *= vignette;

  return col;
}

vec3 sampleCamera(vec2 uv) {
  vec2 texUv = uv;
  texUv.x = 1.0 - texUv.x;
  if (uHasCameraTexture < 0.5) {
    return vec3(0.05, 0.05, 0.08);
  }
  return texture(uCameraTexture, texUv).rgb;
}

void main() {
  float rotSpeed = uKaleidoRotation / 100.0;
  float rot = uTime * rotSpeed * TAU * 0.08;
  vec2 kUv = kaleidoscopeUv(vUv, uSegments, uMirror, rot);

  vec3 col;
  if (uMode < 0.5) {
    col = generativeColor(kUv);
  } else {
    col = sampleCamera(kUv);
  }

  outColor = vec4(col, 1.0);
}
`;
