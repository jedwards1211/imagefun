/**
 * @flow
 * @prettier
 */

export default function getAttribLocations<Name: string>(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  ...names: Array<Name>
): { [Name]: number } {
  const result = {}
  names.forEach(name => (result[name] = gl.getAttribLocation(program, name)))
  return result
}
