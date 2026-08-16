import {
  createProgram,
  getUniformLocations,
  createFullscreenQuad,
} from "./context.js";

/**
 * @param {WebGL2RenderingContext} gl
 * @param {ReturnType<typeof getUniformLocations>} uniforms
 * @param {object} state
 * @param {number} time
 * @param {number} autoSeed
 * @param {WebGLTexture | null} cameraTexture
 * @param {boolean} hasCamera
 */
export const drawFrame = (
  gl,
  program,
  vao,
  uniforms,
  state,
  time,
  autoSeed,
  cameraTexture,
  hasCamera
) => {
  gl.useProgram(program);
  gl.bindVertexArray(vao);

  gl.uniform2f(uniforms.uResolution, gl.canvas.width, gl.canvas.height);
  gl.uniform1f(uniforms.uTime, time);
  gl.uniform1f(uniforms.uMode, state.mode === "camera" ? 1 : 0);
  gl.uniform1f(uniforms.uSegments, state.segments);
  gl.uniform1f(uniforms.uMirror, state.mirror ? 1 : 0);
  gl.uniform1f(uniforms.uKaleidoRotation, state.rotation);
  gl.uniform1f(uniforms.uFlow, state.generated.motion);
  gl.uniform1f(uniforms.uComplexity, state.generated.detail);
  gl.uniform1f(uniforms.uSeed, state.generated.seed);
  gl.uniform1f(uniforms.uAutoSeed, autoSeed);
  gl.uniform1f(uniforms.uHasCameraTexture, hasCamera ? 1 : 0);

  gl.activeTexture(gl.TEXTURE0);
  if (hasCamera && cameraTexture) {
    gl.bindTexture(gl.TEXTURE_2D, cameraTexture);
  }
  gl.uniform1i(uniforms.uCameraTexture, 0);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};

/**
 * @param {WebGL2RenderingContext} gl
 */
export const createCameraTexture = (gl) => {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return texture;
};

/**
 * @param {WebGL2RenderingContext} gl
 * @param {WebGLTexture} texture
 * @param {HTMLVideoElement} video
 */
export const uploadVideoFrame = (gl, texture, video) => {
  if (video.readyState < video.HAVE_CURRENT_DATA) return false;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
  return true;
};

export const createRenderer = (gl) => {
  const program = createProgram(gl);
  if (!program) return null;

  const uniforms = getUniformLocations(gl, program);
  const { vao, buffer } = createFullscreenQuad(gl);
  const cameraTexture = createCameraTexture(gl);

  return { program, uniforms, vao, buffer, cameraTexture };
};

export const disposeRenderer = (gl, renderer) => {
  if (!renderer) return;
  gl.deleteProgram(renderer.program);
  gl.deleteVertexArray(renderer.vao);
  gl.deleteBuffer(renderer.buffer);
  gl.deleteTexture(renderer.cameraTexture);
};
