// @flow

import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { type Theme } from '../theme'
import { type NodesState, type UpdateNode } from './nodesRedux'

import NodesActionsContext from './NodesActionsContext'
import useStash from '../hooks/useStash'
import useMouseDrag from '../hooks/useMouseDrag'

import { pick } from 'lodash/fp'

import findParentNodeEl from './findParentNodeEl'

type Classes<Styles> = $Call<<T>((any) => T) => { [$Keys<T>]: string }, Styles>

const styles = (theme: Theme) => ({
  root: {},
})

export type Props = {
  +classes: Classes<typeof styles>,
  +state: NodesState,
  +nodeKinds: { [string]: React.ComponentType<any> },
}

const NodesView = ({
  classes,
  state: { nodes, nodesOrder, selectedNodes },
  nodeKinds,
  ...props
}: Props): React.Node => {
  const children = []
  nodesOrder.forEach((nodeId: string) => {
    const node = nodes.get(nodeId)
    if (node) {
      children.push(
        React.createElement(nodeKinds[node.kind], {
          ...node,
          key: node.id,
          selected: selectedNodes.has(node.id),
        })
      )
    }
  })
  const { setSelectedNodes, updateNodes } = React.useContext(
    NodesActionsContext
  )

  const stash = useStash()
  stash.nodes = nodes
  stash.selectedNodes = selectedNodes

  const handleMouseDown = useMouseDrag(
    React.useCallback(
      (event: MouseEvent | SyntheticMouseEvent<any>) => {
        const { lastEvent, handleDrag, nodes, selectedNodes } = stash
        switch (event.type) {
          case 'mousedown': {
            stash.preventContextMenu = false
            const nodeEl =
              event.target instanceof Element
                ? findParentNodeEl(event.target)
                : null
            const nodeId = nodeEl ? nodeEl.getAttribute('d-nodeid') : null
            if (event.ctrlKey) {
              if (nodeId) {
                stash.preventContextMenu = true
                setSelectedNodes(
                  selectedNodes.has(nodeId)
                    ? selectedNodes.delete(nodeId)
                    : selectedNodes.add(nodeId)
                )
              }
            } else if (event.shiftKey) {
              if (nodeId) setSelectedNodes(selectedNodes.add(nodeId))
            } else {
              setSelectedNodes(nodeEl ? [nodeEl.getAttribute('d-nodeid')] : [])
            }
            stash.handleDrag = nodeEl != null
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

  const handleContextMenu = React.useCallback(e => e.preventDefault(), [])

  return (
    <div
      className={classes.root}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      {...props}
    >
      {children}
    </div>
  )
}

const NodesViewWithStyles = withStyles(styles)(NodesView)

export default NodesViewWithStyles
