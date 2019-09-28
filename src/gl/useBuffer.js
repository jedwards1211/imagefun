/**
 * @flow
 * @prettier
 */
import * as React from 'react'
import { useGL } from './GLCanvas'

export default function useBuffer(): WebGLBuffer {
  const gl = useGL()
  const buffer = React.useMemo(() => gl.createBuffer())
  React.useEffect(() => () => gl.deleteBuffer(buffer))
  return buffer
}
