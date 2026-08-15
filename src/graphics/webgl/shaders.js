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
uniform float uColourShift;
uniform float uComplexity;
uniform float uSaturation;
uniform float uSeed;
uniform float uAutoSeed;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0 + vec2(100.0);
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

vec3 ambientColor(vec2 uv) {
  float flow = uFlow / 50.0;
  float shift = uColourShift / 100.0;
  float complexity = mix(0.5, 4.0, uComplexity / 100.0);
  float sat = uSaturation / 100.0;
  float t = uTime * (0.05 + flow * 0.15);
  vec2 p = (uv - 0.5) * complexity;
  p += vec2(sin(t * 0.7 + uSeed), cos(t * 0.5 + uAutoSeed)) * flow;
  float n = fbm(p + vec2(uSeed * 0.01, uAutoSeed * 0.013) + t * 0.2);
  float n2 = fbm(p * 1.7 - t * 0.15 + uAutoSeed);
  float hue = fract(n * 0.6 + n2 * 0.4 + t * shift * 0.1 + uSeed * 0.001);
  float light = 0.35 + n * 0.45 + n2 * 0.2;
  vec3 col = hsl2rgb(vec3(hue, sat, clamp(light, 0.0, 1.0)));
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
    col = ambientColor(kUv);
  } else {
    col = sampleCamera(kUv);
  }

  outColor = vec4(col, 1.0);
}
`;
