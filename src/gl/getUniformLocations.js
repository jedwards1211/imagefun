/**
 * @flow
 * @prettier
 */

export default function getUniformLocations<Name: string>(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  ...names: Array<Name>
): { [Name]: WebGLUniformLocation } {
  const result: { [Name]: WebGLUniformLocation } = ({}: any)
  names.forEach(name => (result[name] = gl.getUniformLocation(program, name)))
  return result
}
