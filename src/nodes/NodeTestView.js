/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import { styled } from '@material-ui/styles'
import { spacing, display, flexbox, compose } from '@material-ui/system'
import DefaultNode from './DefaultNode'

const Box = styled('div')(
  compose(
    display,
    flexbox,
    spacing
  )
)

export type Props = {}

const inputs = [
  { name: 'image' },
  { name: 'amount' },
  { name: 'span' },
  { name: 'rotate' },
]
const outputs = [{ name: 'image' }]

const NodeTestView = (props: Props): React.Node => (
  <Box margin={5} display="flex" flexDirection="column" alignItems="flex-start">
    <Box padding={1}>
      <DefaultNode id="horiz" name="horiz" outputs={outputs} />
    </Box>
    <Box padding={1}>
      <DefaultNode id="normal" name="text" inputs={inputs} outputs={outputs} />
    </Box>
    <Box padding={1}>
      <DefaultNode
        id="selected"
        name="text"
        inputs={inputs}
        outputs={outputs}
        selected
      />
    </Box>
    <Box padding={1}>
      <DefaultNode
        id="content"
        name="content"
        inputs={inputs}
        outputs={outputs}
      >
        <img
          src="https://media0.giphy.com/media/8MRm1sIaA18EU/giphy.gif"
          width="200"
        />
      </DefaultNode>
    </Box>
  </Box>
)

export default NodeTestView
