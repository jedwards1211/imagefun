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
import { useSetTerminalOffset } from './TerminalOffsetsContext'
import { type Direction } from './Direction'

import NodesActionsContext from './NodesActionsContext'

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
  +direction: Direction,
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
  const {
    id: node,
    selected: nodeSelected,
    selectedTerminals,
  } = useNodeContext()
  const selected =
    nodeSelected ||
    (selectedTerminals ? selectedTerminals.hasIn([direction, name]) : false)

  const {
    setSelectedTerminals,
    addSelectedTerminals,
    toggleSelectedTerminals,
  } = React.useContext(NodesActionsContext)

  const handleMouseDown = React.useCallback(
    (event: SyntheticMouseEvent<any>) => {
      if (event.ctrlKey) toggleSelectedTerminals([[node, direction, name]])
      else if (event.shiftKey) addSelectedTerminals([[node, direction, name]])
      else setSelectedTerminals([[node, direction, name]])
    },
    [setSelectedTerminals, addSelectedTerminals, toggleSelectedTerminals]
  )

  const setTerminalOffset = useSetTerminalOffset()
  const ref = React.useCallback(
    (el: ?Element) => {
      const nodeEl = findParentNodeEl(el)
      if (!el || !nodeEl) return
      const terminalRect = el.getBoundingClientRect()
      const nodeRect = nodeEl.getBoundingClientRect()
      setTerminalOffset(
        node,
        direction,
        name,
        terminalRect.top - nodeRect.top,
        terminalRect.left - nodeRect.left
      )
    },
    [node]
  )
  return (
    <Box
      data-terminalname={name}
      data-terminaldirection={direction}
      width={0}
      height={0}
      position="relative"
      className={classNames(classes?.root, className)}
      ref={ref}
      {...props}
    >
      <Box
        display="inline-block"
        bgcolor="white"
        border={border}
        borderColor={selected ? 'hsl(78, 100%, 30%)' : '#555'}
        borderRadius="100%"
        position="absolute"
        top={offset}
        left={offset}
        width={size}
        height={size}
        className={classes?.knob}
        onMouseDown={handleMouseDown}
      />
    </Box>
  )
}

export default Terminal
