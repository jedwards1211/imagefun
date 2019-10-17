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

export type Props = {
  img: ?HTMLImageElement,
  amount: number,
  cutoff: number,
  span: number,
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

uniform sampler2D u_img;
uniform float u_amount;
uniform float u_cutoff;
uniform float u_width;
uniform float u_height;
uniform float u_span;

void main() {
  vec4 left = texture2D(u_img, v_texCoord - vec2(u_span / u_width, 0));
  vec4 right = texture2D(u_img, v_texCoord + vec2(u_span / u_width, 0));
  vec4 down = texture2D(u_img, v_texCoord - vec2(0, u_span / u_height));
  vec4 up = texture2D(u_img, v_texCoord + vec2(0, u_span / u_height));
  vec2 gradient = vec2(
    length(right) - length(left),
    length(up) - length(down)
  );
  if (length(gradient) > u_cutoff) {
    gradient = vec2(0, 0);
  }
  gl_FragColor = texture2D(u_img, v_texCoord + gradient * u_amount);
}
`

const InflateGradientRenderer = ({
  img,
  amount,
  cutoff,
  span,
}: Props): React.Node => {
  const gl = useGL()

  const tex = useTexture()
  React.useMemo(
    () => {
      if (!img) return
      texImage(gl, tex, img)
    },
    [img]
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
  const {
    u_img,
    u_span,
    u_amount,
    u_cutoff,
    u_width,
    u_height,
  } = getUniformLocations(
    gl,
    program,
    'u_span',
    'u_img',
    'u_amount',
    'u_cutoff',
    'u_width',
    'u_height'
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
  if (img) {
    gl.uniform1i(u_img, 0)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, tex)
  }
  gl.uniform1f(u_width, gl.canvas.width)
  gl.uniform1f(u_height, gl.canvas.height)
  gl.uniform1f(u_span, span)
  gl.uniform1f(u_amount, amount)
  gl.uniform1f(u_cutoff, cutoff)
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

export default InflateGradientRenderer

function texImage(
  gl: WebGLRenderingContext,
  texture: WebGLTexture,
  image: HTMLImageElement
) {
  gl.bindTexture(gl.TEXTURE_2D, texture)

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
}

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
