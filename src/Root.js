/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import SampleByColor from './SampleByColor'
import Button from '@material-ui/core/Button'
import { styled, ThemeProvider } from '@material-ui/styles'
import { palette } from '@material-ui/system'
import InflateGradientView from './InflateGradientView'
import theme from './theme'

import NodeTestView from './nodes/NodeTestView'

import NodeTestView2 from './nodes/NodeTestView2'

const Box = styled('div')(palette)

export type Props = {}

if (process.env.NODE_ENV !== 'production') {
  window.theme = theme
}

const Root = (props: Props): React.Node => (
  <ThemeProvider theme={theme}>
    <Router>
      <Box bgcolor="#eee">
        <Button component={Link} to="/sampleByColor">
          Sample by Color
        </Button>
        <Button component={Link} to="/inflateGradient">
          Inflate Gradient
        </Button>
        <Button component={Link} to="/node">
          Node Test
        </Button>
        <Button component={Link} to="/node2">
          Node Test 2
        </Button>
      </Box>
      <Route path="/sampleByColor" component={SampleByColor} />
      <Route path="/inflateGradient" component={InflateGradientView} />
      <Route path="/node" component={NodeTestView} />
      <Route path="/node2" component={NodeTestView2} />
    </Router>
  </ThemeProvider>
)

export default Root
