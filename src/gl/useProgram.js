/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import createProgram from './createProgram'
import { useGL } from './GLCanvas'

export default function useProgram(
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram {
  const gl = useGL()
  const program = React.useMemo(
    () => createProgram(gl, vertexShader, fragmentShader),
    [vertexShader, fragmentShader]
  )
  React.useEffect(
    () => () => {
      gl.deleteProgram(program)
    },
    [program]
  )
  return program
}
