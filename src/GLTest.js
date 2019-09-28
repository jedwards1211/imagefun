/**
 * @flow
 * @prettier
 */

import * as React from 'react'

import { useGL } from './gl/GLCanvas'
import useShader from './gl/useShader'
import useProgram from './gl/useProgram'
import getAttribLocations from './gl/getAttribLocations'
import useBuffer from './gl/useBuffer'

export type Props = {}

const vertexShaderCode = `
// an attribute will receive data from a buffer
attribute vec4 a_position;
varying vec4 v_position;

// all shaders have a main function
void main() {
  v_position = a_position;

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`

const fragmentShaderCode = `
// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;
varying vec4 v_position;

void main() {
  // gl_FragColor is a special variable a fragment shader
  // is responsible for setting
  gl_FragColor = vec4(1, v_position.x, 0.5, 1); // return redish-purple
}
`

const GLTest = (props: Props): React.Node => {
  const gl = useGL()
  const vertexShader = useShader(gl.VERTEX_SHADER, vertexShaderCode)
  const fragmentShader = useShader(gl.FRAGMENT_SHADER, fragmentShaderCode)
  const program = useProgram(vertexShader, fragmentShader)
  const { a_position } = getAttribLocations(gl, program, 'a_position')
  const positionBuffer = useBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  React.useMemo(
    () => {
      const positions = [0, 0, 0, 0.5, 0.7, 0]
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW
      )
    },
    [positionBuffer]
  )
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  gl.useProgram(program)
  gl.enableVertexAttribArray(a_position)
  {
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 2 // 2 components per iteration
    const type = gl.FLOAT // the data is 32bit floats
    const normalize = false // don't normalize the data
    const stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0 // start at the beginning of the buffer
    gl.vertexAttribPointer(a_position, size, type, normalize, stride, offset)
  }
  {
    const primitiveType = gl.TRIANGLES
    const offset = 0
    const count = 3
    gl.drawArrays(primitiveType, offset, count)
  }
  return <React.Fragment />
}

export default GLTest
