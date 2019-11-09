/**
 * @flow
 * @prettier
 */

import * as React from 'react'

import { styled } from '@material-ui/styles'
import {
  palette,
  borders,
  sizing,
  compose,
  display,
  positions,
} from '@material-ui/system'
import { useNodeContext } from './NodeContainer'
import classNames from 'classnames'
import findParentNodeEl from './findParentNodeEl'
const Box = styled('div')(
  compose(
    borders,
    display,
    palette,
    positions,
    sizing
  )
)

export type Props = {
  +direction: 'input' | 'output',
  +side: 'top' | 'left' | 'bottom' | 'right',
  +name: string,
  +className?: ?string,
  +classes?: ?$Shape<{ root: string, knob: string }>,
}

const size = 8
const borderWidth = 1

const border = `${borderWidth}px solid #555`
const offset = -size / 2 - borderWidth

const Terminal = ({
  direction,
  name,
  side,
  classes,
  className,
  ...props
}: Props): React.Node => {
  const { id: nodeId } = useNodeContext()
  const ref = React.useCallback(
    (el: ?Element) => {
      const nodeEl = findParentNodeEl(el)
      if (!el || !nodeEl) return
      const terminalRect = el.getBoundingClientRect()
      const nodeRect = nodeEl.getBoundingClientRect()
      const offset = {
        x: terminalRect.left - nodeRect.left,
        y: terminalRect.top - nodeRect.top,
      }
      console.log(nodeId, name, offset)
    },
    [nodeId]
  )
  return (
    <Box
      width={0}
      height={0}
      position="relative"
      className={classNames(classes?.root, className)}
      {...props}
    >
      <Box
        display="inline-block"
        bgcolor="white"
        border={border}
        borderRadius="100%"
        position="absolute"
        top={offset}
        left={offset}
        width={size}
        height={size}
        ref={ref}
        className={classes?.knob}
      />
    </Box>
  )
}

export default Terminal
