/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import { useGL } from './gl/GLCanvas'
import useShader from './gl/useShader'
import useProgram from './gl/useProgram'
import getAttribLocations from './gl/getAttribLocations'
import getUniformLocations from './gl/getUniformLocations'
import {
  putUniforms,
  type Uniforms,
  glslUniformDeclarations,
} from './gl/Uniforms'

import useDrawRectangle from './gl/useDrawRectangle'
import useTexImage from './gl/useTexImage'

export const uniforms: Uniforms = {
  u_amount: { type: 'float', default: 0, min: -2, max: 2 },
  u_cutoff: { type: 'float', default: 5, min: 0, max: 5 },
  u_span: { type: 'float', default: 1, min: -10, max: 10 },
  u_width: { type: 'float', default: 1 },
  u_height: { type: 'float', default: 1 },
  u_x: { type: 'float', default: 0, min: -1, max: 1 },
  u_y: { type: 'float', default: 0, min: -1, max: 1 },
  u_rotation: { type: 'float', default: 0, min: -2, max: 2 },
}

export type Props = {
  img: ?TexImageSource,
  values: { [$Keys<Uniforms>]: any },
}

const vertexShaderCode = `
precision highp float;

${glslUniformDeclarations(uniforms)}

// an attribute will receive data from a buffer
attribute vec2 a_texCoord;
attribute vec4 a_position;

varying vec2 v_texCoord;

varying vec2 v_left;
varying vec2 v_right;
varying vec2 v_down;
varying vec2 v_up;

// all shaders have a main function
void main() {
  v_texCoord = a_texCoord + vec2(-u_x, u_y);

  float texelWidth = u_span / u_width;
  float texelHeight = u_span / u_height;
  v_left = a_texCoord - vec2(texelWidth, 0);
  v_right = a_texCoord + vec2(texelWidth, 0);
  v_down = a_texCoord - vec2(0, texelHeight);
  v_up = a_texCoord + vec2(0, texelHeight);

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}
`

const fragmentShaderCode = `
precision highp float;

${glslUniformDeclarations(uniforms)}

varying vec2 v_texCoord;

varying vec2 v_left;
varying vec2 v_right;
varying vec2 v_down;
varying vec2 v_up;

uniform sampler2D u_img;

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

void main() {
  vec4 left = texture2D(u_img, v_left);
  vec4 right = texture2D(u_img, v_right);
  vec4 down = texture2D(u_img, v_down);
  vec4 up = texture2D(u_img, v_up);
  vec2 gradient = vec2(
    length(right) - length(left),
    length(up) - length(down)
  );
  gradient = rotate(gradient, u_rotation);
  if (length(gradient) > u_cutoff) {
    gradient = vec2(0, 0);
  }
  vec4 color = texture2D(u_img, v_texCoord + gradient * u_amount);
  gl_FragColor = color;
}
`

const InflateGradientRenderer = ({ img, values }: Props): React.Node => {
  const gl = useGL()
  const tex = useTexImage(img)

  const vertexShader = useShader(gl.VERTEX_SHADER, vertexShaderCode)
  const fragmentShader = useShader(gl.FRAGMENT_SHADER, fragmentShaderCode)
  const program = useProgram(vertexShader, fragmentShader)

  const { width, height } = gl.canvas

  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.viewport(0, 0, width, height)

  gl.useProgram(program)
  if (img) {
    const { u_img } = getUniformLocations(gl, program, 'u_img')
    gl.uniform1i(u_img, 0)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, tex)
  }
  putUniforms(gl, program, uniforms, {
    ...values,
    u_width: width,
    u_height: height,
  })
  const drawRectangle = useDrawRectangle()
  drawRectangle({
    ...getAttribLocations(gl, program, 'a_position', 'a_texCoord'),
    x: -1,
    y: 1,
    width: 2,
    height: -2,
  })

  return <React.Fragment />
}

export default InflateGradientRenderer
