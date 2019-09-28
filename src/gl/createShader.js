/**
 * @flow
 * @prettier
 */

export default function createShader(
  gl: WebGLRenderingContext,
  type: any,
  source: string
): WebGLShader {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!success) {
    gl.deleteShader(shader)
    throw new Error(`failed to create shader`)
  }
  return shader
}
