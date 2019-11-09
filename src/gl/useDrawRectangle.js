/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import { useGL } from './GLCanvas'
import useBuffer from './useBuffer'

const useDrawRectangle = (): (({
  x: number,
  y: number,
  width: number,
  height: number,
  a_position: number,
  a_texCoord: number,
}) => void) => {
  const gl = useGL()

  const positionBuffer = useBuffer()

  const texCoordBuffer = useBuffer()
  React.useMemo(
    () => {
      gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          0.0,
          0.0,
          1.0,
          0.0,
          0.0,
          1.0,
          0.0,
          1.0,
          1.0,
          0.0,
          1.0,
          1.0,
        ]),
        gl.STATIC_DRAW
      )
    },
    [texCoordBuffer]
  )

  return ({
    x,
    y,
    width,
    height,
    a_position,
    a_texCoord,
  }: {
    x: number,
    y: number,
    width: number,
    height: number,
    a_position: number,
    a_texCoord: number,
  }) => {
    gl.enableVertexAttribArray(a_position)
    {
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      setRectangle(gl, x, y, width, height)
      // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      const size = 2 // 2 components per iteration
      const type = gl.FLOAT // the data is 32bit floats
      const normalize = false // don't normalize the data
      const stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
      const offset = 0 // start at the beginning of the buffer
      gl.vertexAttribPointer(a_position, size, type, normalize, stride, offset)
    }
    gl.enableVertexAttribArray(a_texCoord)
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    gl.vertexAttribPointer(a_texCoord, 2, gl.FLOAT, false, 0, 0)
    {
      const primitiveType = gl.TRIANGLES
      const offset = 0
      const count = 6
      gl.drawArrays(primitiveType, offset, count)
    }
  }
}

export default useDrawRectangle

function setRectangle(
  gl: WebGLRenderingContext,
  x: number,
  y: number,
  width: number,
  height: number
) {
  var x1 = x
  var x2 = x + width
  var y1 = y
  var y2 = y + height
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.DYNAMIC_DRAW
  )
}
