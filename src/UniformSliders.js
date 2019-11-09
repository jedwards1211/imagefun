/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import { type Uniforms } from './gl/Uniforms'
import { styled } from '@material-ui/styles'
import { display, flexbox, compose } from '@material-ui/system'
import { pickBy, toPairs, map, startCase } from 'lodash/fp'

import Slider from './Slider'

import Typography from '@material-ui/core/Typography'

import { pipeline } from './util/pipeline'

const Box = styled('div')(
  compose(
    display,
    flexbox
  )
)

export type Props = {
  uniforms: Uniforms,
  values: { [$Keys<Uniforms>]: any },
  onChange?: ?(name: string, value: number) => any,
}

const UniformSliders = ({ uniforms, values, onChange }: Props): React.Node => (
  <Box display="flex" flexDirection="column">
    {pipeline(
      uniforms,
      pickBy(
        u =>
          u.type === 'float' &&
          typeof u.min === 'number' &&
          typeof u.max === 'number'
      ),
      toPairs,
      map(([name, { type, min, max }]) => (
        <div key={name}>
          <Typography variant="h6">
            {startCase(name.replace(/^u_/, ''))}
          </Typography>
          <Slider
            value={values[name]}
            min={min}
            max={max}
            onChange={(value: number) => {
              if (onChange) onChange(name, value)
            }}
          />
        </div>
      ))
    )}
  </Box>
)

export default UniformSliders
