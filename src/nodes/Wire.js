// @flow

import * as React from 'react'
import { type NodeAndTerminal, type Nodes } from './nodesRedux'
import { useTerminalOffset } from './TerminalOffsetsContext'
import NodesActionsContext from './NodesActionsContext'

export type Props = {
  +id: string,
  +from: NodeAndTerminal,
  +to: NodeAndTerminal,
  +nodes: Nodes,
  +className?: ?string,
}

const Wire = ({ id, from, to, nodes, className }: Props): React.Node => {
  const {
    setSelectedWires,
    addSelectedWires,
    toggleSelectedWires,
  } = React.useContext(NodesActionsContext)

  const handleMouseDown = React.useCallback(
    (event: SyntheticMouseEvent<any>) => {
      if (event.ctrlKey) toggleSelectedWires([id])
      else if (event.shiftKey) addSelectedWires([id])
      else setSelectedWires([id])
    },
    [setSelectedWires, addSelectedWires, toggleSelectedWires]
  )

  const fromOffset = useTerminalOffset(from.node, 'output', from.terminal)
  const toOffset = useTerminalOffset(to.node, 'input', to.terminal)
  const fromNode = nodes.get(from.node)
  const toNode = nodes.get(to.node)

  if (!fromOffset || !toOffset || !fromNode || !toNode)
    return <React.Fragment />

  const x0 = fromNode.left + fromOffset.left
  const y0 = fromNode.top + fromOffset.top
  const x1 = toNode.left + toOffset.left
  const y1 = toNode.top + toOffset.top

  const stretch = Math.max(
    x1 > x0 ? (x1 - x0) / 2 : x0 - x1,
    Math.abs(y0 - y1) / 2
  )

  const d = `M ${x0},${y0}
C ${x0 + stretch},${y0} ${x1 - stretch},${y1} ${x1},${y1}`
  return (
    <path
      data-wireid={id}
      stroke="black"
      fill="none"
      strokeWidth={2}
      d={d}
      className={className}
      onMouseDown={handleMouseDown}
    />
  )
}

export default Wire
