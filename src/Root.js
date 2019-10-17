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

import { createMuiTheme } from '@material-ui/core/styles'
import purple from '@material-ui/core/colors/purple'
import green from '@material-ui/core/colors/green'

import InflateGradientView from './InflateGradientView'

const Box = styled('div')(palette)

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: green,
  },
})

export type Props = {}

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
      </Box>
      <Route path="/sampleByColor" component={SampleByColor} />
      <Route path="/inflateGradient" component={InflateGradientView} />
    </Router>
  </ThemeProvider>
)

export default Root
