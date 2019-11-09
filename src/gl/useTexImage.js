/**
 * @flow
 * @prettier
 */
import useTexture from './useTexture'
import * as React from 'react'
import texImage from './texImage'
import { useGL } from './GLCanvas'

export default function useTexImage(image: ?TexImageSource): WebGLTexture {
  const gl = useGL()
  const texture = useTexture()
  React.useMemo(
    () => {
      if (image) texImage(gl, texture, image)
    },
    [texture, image]
  )
  return texture
}
