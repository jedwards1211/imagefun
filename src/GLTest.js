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
import useTexture from './gl/useTexture'
import getUniformLocations from './gl/getUniformLocations'

import texImage from './gl/texImage'

export type Props = {
  img1: ?HTMLImageElement,
  img2: ?HTMLImageElement,
  matrix: Array<number>,
}

const vertexShaderCode = `
precision highp float;

// an attribute will receive data from a buffer
attribute vec2 a_texCoord;
attribute vec4 a_position;
varying vec4 v_position;
varying vec2 v_texCoord;

// all shaders have a main function
void main() {
  v_position = a_position;
  v_texCoord = a_texCoord;

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`

const fragmentShaderCode = `
precision highp float;

varying vec4 v_position;
varying vec2 v_texCoord;

uniform sampler2D u_img1;
uniform sampler2D u_img2;
uniform mat4 u_matrix;

void main() {
  // gl_FragColor is a special variable a fragment shader
  // is responsible for setting
  // gl_FragColor = vec4(1, v_position.x, 0.5, 1); // return redish-purple
  vec4 color1 = vec4(texture2D(u_img1, v_texCoord).xyz, 1.0) * u_matrix;
  gl_FragColor = texture2D(u_img2, color1.xy);
}
`

const GLTest = ({ img1, img2, matrix }: Props): React.Node => {
  const gl = useGL()

  const tex1 = useTexture()
  const tex2 = useTexture()
  React.useMemo(
    () => {
      if (!img1) return
      texImage(gl, tex1, img1)
    },
    [img1]
  )
  React.useMemo(
    () => {
      if (!img2) return
      texImage(gl, tex2, img2)
    },
    [img2]
  )

  const vertexShader = useShader(gl.VERTEX_SHADER, vertexShaderCode)
  const fragmentShader = useShader(gl.FRAGMENT_SHADER, fragmentShaderCode)
  const program = useProgram(vertexShader, fragmentShader)
  const { a_position, a_texCoord } = getAttribLocations(
    gl,
    program,
    'a_position',
    'a_texCoord'
  )
  const { u_img1, u_img2, u_matrix } = getUniformLocations(
    gl,
    program,
    'u_img1',
    'u_img2',
    'u_matrix'
  )
  const positionBuffer = useBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  React.useMemo(
    () => {
      setRectangle(gl, -1, 1, 2, -2)
    },
    [positionBuffer]
  )

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

  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  gl.useProgram(program)
  if (img1) {
    gl.uniform1i(u_img1, 0)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, tex1)
  }
  if (img2) {
    gl.uniform1i(u_img2, 1)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, tex2)
  }
  gl.uniformMatrix4fv(u_matrix, false, matrix)
  gl.enableVertexAttribArray(a_position)
  {
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
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
  return <React.Fragment />
}

export default GLTest

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
    gl.STATIC_DRAW
  )
}
