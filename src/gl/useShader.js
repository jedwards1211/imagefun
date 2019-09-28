/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import createShader from './createShader'
import { useGL } from './GLCanvas'

export default function useShader(type: any, source: string): WebGLShader {
  const gl = useGL()
  const shader = React.useMemo(() => createShader(gl, type, source), [
    type,
    source,
  ])
  React.useEffect(
    () => () => {
      gl.deleteShader(shader)
    },
    [shader]
  )
  return shader
}
