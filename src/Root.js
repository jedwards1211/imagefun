import * as React from 'react'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import purple from '@material-ui/core/colors/purple'
import green from '@material-ui/core/colors/green'
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

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: green,
  },
})

const initMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1]

const Root = () => {
  const [img1, setImg1] = React.useState(null)
  const [img2, setImg2] = React.useState(null)
  const [matrix, onMatrixChange] = React.useState(initMatrix)
  return (
    <ThemeProvider theme={theme}>
      <Box display="flex">
        <Box display="flex" flexDirection="column" alignItems="center">
          <ImageBin size={300} value={img1} onChange={setImg1} />
          <Box margin={2}>
            <ArrowDownward />
          </Box>
          <Box boxShadow={2} padding={2} bgcolor="white">
            <RGBXYMatrixInputs value={matrix} onChange={onMatrixChange} />
          </Box>
          <Box margin={2}>
            <ArrowDownward />
          </Box>
          <ImageBin size={300} value={img2} onChange={setImg2} />
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
              <GLTest />
            </GLCanvas>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default Root
