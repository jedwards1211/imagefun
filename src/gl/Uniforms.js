/**
 * @flow
 * @prettier
 */
// @flow-runtime enable

import { map, forOwn, mapValues } from 'lodash'

import * as React from 'react'
import getUniformLocations from './getUniformLocations'

type FloatUniform = {
  type: 'float',
  default: number,
  min?: number,
  max?: number,
}

type Uniform = FloatUniform

export type Uniforms = { [name: string]: Uniform, ... }

export function glslUniformDeclarations(uniforms: Uniforms): string {
  return map(uniforms, ({ type }, name) => `uniform ${type} ${name};`).join(
    '\n'
  )
}

export function putUniforms(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  uniforms: Uniforms,
  values: $Shape<{ [$Keys<Uniforms>]: any }>
) {
  const locations = React.useMemo(
    () => getUniformLocations(gl, program, ...Object.keys(uniforms)),
    [program, uniforms]
  )
  forOwn(uniforms, (u: Uniform, name: string) => {
    switch (u.type) {
      case 'float':
        gl.uniform1f(locations[name], values[name] ?? u.default)
    }
  })
}

export function useUniforms(
  uniforms: Uniforms,
  key?: string
): [{ [$Keys<Uniforms>]: any }, ($Keys<Uniforms>, value: any) => any] {
  const initValues = React.useMemo(
    (): any => {
      const str = key ? localStorage.getItem(key) : null
      if (str) {
        const values = JSON.parse(str)
        let valid = true
        for (const name in uniforms) {
          const { type } = uniforms[name]
          switch (type) {
            case 'float':
              if (typeof values[name] !== 'number') valid = false
              break
          }
        }
        if (valid) return values
      }
      return mapValues(uniforms, u => u.default)
    },
    [uniforms]
  )
  const [values, dispatch] = React.useReducer(
    (values, { name, value }) => ({ ...values, [name]: value }),
    initValues
  )
  React.useEffect(
    () => {
      if (key) localStorage.setItem(key, JSON.stringify(values))
    },
    [key, values]
  )
  const onChange = React.useCallback(
    (name: $Keys<Uniforms>, value: any) => dispatch({ name, value }),
    [dispatch]
  )
  return [values, onChange]
}
