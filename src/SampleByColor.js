import * as React from 'react'
import ImageBin from './ImageBin'
import RGBXYMatrixInputs from './RGBXYMatrixInputs'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
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
import GLTest from './GLTest'

import Slider from './Slider'

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

const initMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

const parseNumber = (value: string): number => {
  const parsed = parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const SampleByColor = () => {
  const [img1, setImg1] = React.useState(null)
  const [img2, setImg2] = React.useState(null)
  const [matrix1, onMatrix1Change] = React.useState(initMatrix)
  const [matrix2, onMatrix2Change] = React.useState(initMatrix)
  const [interp, onInterpChange] = React.useState(0)
  const [imgEl1, setImgEl1] = React.useState(null)
  const [imgEl2, setImgEl2] = React.useState(null)
  const parsedMatrix1 = React.useMemo(() => matrix1.map(parseNumber), [matrix1])
  const parsedMatrix2 = React.useMemo(() => matrix2.map(parseNumber), [matrix2])
  const matrix = React.useMemo(
    () => {
      const f = interp
      const rf = 1 - interp
      return parsedMatrix1.map(
        (value, index) => rf * value + f * parsedMatrix2[index]
      )
    },
    [parsedMatrix1, parsedMatrix2, interp]
  )
  return (
    <Box display="flex">
      <Box display="flex" flexDirection="column" alignItems="center">
        <ImageBin
          size={300}
          value={img1}
          onChange={setImg1}
          onLoad={setImgEl1}
        />
        <Box margin={2}>
          <ArrowDownward />
        </Box>
        <Box boxShadow={2} padding={2} bgcolor="white">
          <RGBXYMatrixInputs value={matrix1} onChange={onMatrix1Change} />
          <Slider min={0} max={1} value={interp} onChange={onInterpChange} />
          <RGBXYMatrixInputs value={matrix2} onChange={onMatrix2Change} />
        </Box>
        <Box margin={2}>
          <ArrowDownward />
        </Box>
        <ImageBin
          size={300}
          value={img2}
          onChange={setImg2}
          onLoad={setImgEl2}
        />
      </Box>
      <Box marginLeft={4}>
        <Typography variant="h3" align="center">
          Result
        </Typography>
        <Box
          marginTop={1}
          width={600}
          height={600}
          boxShadow={2}
          bgcolor="white"
        >
          <GLCanvas width={600} height={600}>
            <GLTest img1={imgEl1} img2={imgEl2} matrix={matrix} />
          </GLCanvas>
        </Box>
      </Box>
    </Box>
  )
}

export default SampleByColor
