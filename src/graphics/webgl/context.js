import { VERTEX_SHADER, FRAGMENT_SHADER } from "./shaders.js";

/**
 * @param {WebGL2RenderingContext} gl
 * @param {number} type
 * @param {string} source
 */
const compileShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

/**
 * @param {WebGL2RenderingContext} gl
 */
export const createProgram = (gl) => {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
};

/**
 * @param {WebGL2RenderingContext} gl
 * @param {WebGLProgram} program
 */
export const getUniformLocations = (gl, program) => ({
  uResolution: gl.getUniformLocation(program, "uResolution"),
  uTime: gl.getUniformLocation(program, "uTime"),
  uMode: gl.getUniformLocation(program, "uMode"),
  uCameraTexture: gl.getUniformLocation(program, "uCameraTexture"),
  uHasCameraTexture: gl.getUniformLocation(program, "uHasCameraTexture"),
  uSegments: gl.getUniformLocation(program, "uSegments"),
  uMirror: gl.getUniformLocation(program, "uMirror"),
  uKaleidoRotation: gl.getUniformLocation(program, "uKaleidoRotation"),
  uFlow: gl.getUniformLocation(program, "uFlow"),
  uComplexity: gl.getUniformLocation(program, "uComplexity"),
  uSeed: gl.getUniformLocation(program, "uSeed"),
  uAutoSeed: gl.getUniformLocation(program, "uAutoSeed"),
  uPatternScale: gl.getUniformLocation(program, "uPatternScale"),
});

/**
 * @param {WebGL2RenderingContext} gl
 */
export const createFullscreenQuad = (gl) => {
  const vao = gl.createVertexArray();
  const buffer = gl.createBuffer();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);
  return { vao, buffer };
};

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {WebGL2RenderingContext | null}
 */
export const initWebGL = (canvas) => {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    powerPreference: "high-performance",
  });
  return gl;
};
