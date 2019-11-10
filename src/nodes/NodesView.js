// @flow

import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { type Theme } from '../theme'
import { type NodesState, type UpdateNode } from './nodesRedux'
import NodesActionsContext from './NodesActionsContext'
import useStash from '../hooks/useStash'
import useMouseDrag from '../hooks/useMouseDrag'
import { pick } from 'lodash/fp'
import { findParentNodeId } from './findParentNodeEl'
import { TerminalOffsetsProvider } from './TerminalOffsetsContext'
import { type Wire as WireState } from './nodesRedux'
import Wire from './Wire'

import NodeContainer from './NodeContainer'

import { findParentWireId } from './findParentWireEl'

type Classes<Styles> = $Call<<T>((any) => T) => { [$Keys<T>]: string }, Styles>

const styles = (theme: Theme) => ({
  root: {
    position: 'relative',
  },
  wire: {
    stroke: '#555',
    '&:hover': {
      stroke: 'hsl(78, 100%, 45%)',
    },
  },
  wireSelected: {
    stroke: 'hsl(78, 100%, 40%)',
    '&:hover': {
      stroke: 'hsl(78, 100%, 45%)',
    },
  },
})

export type Props = {
  +classes: Classes<typeof styles>,
  +state: NodesState,
  +nodeKinds: { [string]: React.ComponentType<any> },
  +style?: ?Object,
  +width: number,
  +height: number,
}

const NodesView = ({
  classes,
  state: {
    nodes,
    nodesOrder,
    selectedNodes,
    wires,
    selectedWires,
    selectedTerminals,
  },
  nodeKinds,
  width,
  height,
  style,
  ...props
}: Props): React.Node => {
  const { clearSelection, updateNodes, deleteSelected } = React.useContext(
    NodesActionsContext
  )

  const stash = useStash({ nodes, selectedNodes })

  const handleMouseDown = useMouseDrag(
    React.useCallback(
      (event: MouseEvent | SyntheticMouseEvent<any>) => {
        const { lastEvent, handleDrag, nodes, selectedNodes } = stash
        switch (event.type) {
          case 'mousedown': {
            stash.preventContextMenu = false
            const nodeId =
              event.target instanceof Element
                ? findParentNodeId(event.target)
                : null
            const wireId =
              event.target instanceof Element
                ? findParentWireId(event.target)
                : null
            if (!event.ctrlKey && !event.shiftKey && !nodeId && !wireId) {
              clearSelection()
            }
            stash.handleDrag = nodeId != null
            break
          }
          case 'mousemove': {
            if (!handleDrag || !lastEvent || !selectedNodes.size) break
            const dx = event.clientX - lastEvent.clientX
            const dy = event.clientY - lastEvent.clientY
            updateNodes(
              ...[...selectedNodes]
                .map(
                  (id: string): ?UpdateNode => {
                    const node = nodes.get(id)
                    if (!node) return
                    const { left, top } = node
                    return { id, left: left + dx, top: top + dy }
                  }
                )
                .filter(Boolean)
            )
            break
          }
        }
        stash.lastEvent = pick(['clientX', 'clientY'])(event)
      },
      [updateNodes]
    )
  )

  const handleKeyDown = React.useCallback(
    (event: SyntheticKeyboardEvent<any>) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelected()
      }
    },
    [deleteSelected]
  )

  const handleContextMenu = React.useCallback(e => e.preventDefault(), [])

  const viewBox = React.useMemo(() => `0 0 ${width} ${height}`, [width, height])

  const children = []
  nodesOrder.forEach((nodeId: string) => {
    const node = nodes.get(nodeId)
    if (node) {
      const selected = selectedNodes.has(node.id)
      children.push(
        <NodeContainer
          key={node.id}
          id={node.id}
          selected={selected}
          selectedTerminals={selectedTerminals.get(node.id)}
          left={node.left}
          top={node.top}
        >
          {React.createElement(nodeKinds[node.kind], {
            ...node,
            selected,
          })}
        </NodeContainer>
      )
    }
  })

  return (
    <TerminalOffsetsProvider>
      <div
        tabIndex={0}
        className={classes.root}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
        style={{ ...style, width, height }}
        {...props}
      >
        <svg
          width={width}
          height={height}
          viewBox={viewBox}
          preserveAspectRatio="xMinYMin meet"
        >
          {[...wires.values()].map(
            (wire: WireState): React.Node => {
              const selected =
                selectedWires.has(wire.id) ||
                selectedNodes.has(wire.from.node) ||
                selectedNodes.has(wire.to.node) ||
                selectedTerminals.hasIn([
                  wire.from.node,
                  'output',
                  wire.from.terminal,
                ]) ||
                selectedTerminals.hasIn([
                  wire.to.node,
                  'input',
                  wire.to.terminal,
                ])
              return (
                <Wire
                  key={wire.id}
                  {...wire}
                  nodes={nodes}
                  className={selected ? classes.wireSelected : classes.wire}
                />
              )
            }
          )}
        </svg>
        {children}
      </div>
    </TerminalOffsetsProvider>
  )
}

const NodesViewWithStyles = withStyles(styles)(NodesView)

export default NodesViewWithStyles
