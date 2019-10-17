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
import Slider from './Slider'
import InflateGradientRenderer from './InflateGradientRenderer'

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

const InflateGradientView = () => {
  const [img, setImg] = React.useState(null)
  const [amount, setAmount] = React.useState(0)
  const [cutoff, setCutoff] = React.useState(1)
  const [span, setSpan] = React.useState(1)
  const [imgEl, setImgEl] = React.useState(null)
  return (
    <Box display="flex">
      <ImageBin size={300} value={img} onChange={setImg} onLoad={setImgEl} />
      <Box marginLeft={4}>
        <Typography variant="h3" align="center">
          Result
        </Typography>
        <Typography variant="h6" align="center">
          Gradient Span
        </Typography>
        <Slider min={1} max={10} value={span} onChange={setSpan} />
        <Typography variant="h6" align="center">
          Amount
        </Typography>
        <Slider min={-10} max={10} value={amount} onChange={setAmount} />
        <Typography variant="h6" align="center">
          Cutoff
        </Typography>
        <Slider min={0} max={1} value={cutoff} onChange={setCutoff} />
        <Box
          marginTop={1}
          width={600}
          height={600}
          boxShadow={2}
          bgcolor="white"
        >
          <GLCanvas width={600} height={600}>
            <InflateGradientRenderer
              img={imgEl}
              span={span}
              amount={amount}
              cutoff={cutoff}
            />
          </GLCanvas>
        </Box>
      </Box>
    </Box>
  )
}

export default InflateGradientView
