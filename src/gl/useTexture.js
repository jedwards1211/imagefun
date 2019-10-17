/**
 * @flow
 * @prettier
 */
import * as React from 'react'
import { useGL } from './GLCanvas'

export default function useTexture(): WebGLTexture {
  const gl = useGL()
  const texture = React.useMemo(() => gl.createTexture(), [])
  React.useEffect(() => () => gl.deleteTexture(texture), [texture])
  return texture
}
