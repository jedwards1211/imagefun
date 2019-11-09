/**
 * @flow
 * @prettier
 */
// @flow-runtime enable

import * as React from 'react'
import ImageBin from './ImageBin'
import Typography from '@material-ui/core/Typography'
import { styled } from '@material-ui/styles'
import {
  compose,
  display,
  flexbox,
  sizing,
  shadows,
  spacing,
  palette,
} from '@material-ui/system'
import GLCanvas from './gl/GLCanvas'
import InflateGradientRenderer, { uniforms } from './InflateGradientRenderer'
import { useUniforms } from './gl/Uniforms'
import UniformSliders from './UniformSliders'
import useLocalStorageState from './useLocalStorageState'

import { reify, type Type } from 'flow-runtime'

const Box = styled('div')(
  compose(
    display,
    sizing,
    shadows,
    spacing,
    flexbox,
    palette
  )
)

const InflateGradientView = (): React.Node => {
  const [img, setImg] = useLocalStorageState(
    null,
    'InflateGradientView_img',
    (reify: Type<string>)
  )
  const [imgEl, setImgEl] = React.useState(null)
  const [values, onChange] = useUniforms(
    uniforms,
    'InflateGradientView_uniforms'
  )
  return (
    <Box display="flex">
      <ImageBin size={300} value={img} onChange={setImg} onLoad={setImgEl} />
      <Box marginLeft={4}>
        <Typography variant="h3" align="center">
          Result
        </Typography>
        <UniformSliders
          uniforms={uniforms}
          values={values}
          onChange={onChange}
        />
        <Box
          marginTop={1}
          width={600}
          height={600}
          boxShadow={2}
          bgcolor="white"
        >
          <GLCanvas width={600} height={600}>
            <InflateGradientRenderer img={imgEl} values={values} />
          </GLCanvas>
        </Box>
      </Box>
    </Box>
  )
}

export default InflateGradientView
