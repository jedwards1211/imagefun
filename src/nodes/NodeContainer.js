// @flow

import * as React from 'react'
import { Map as iMap, Set as iSet } from 'immutable'
import NodesActionsContext from './NodesActionsContext'

import findParentTerminalEl from './findParentTerminalEl'

export type NodeContextProps = {
  +id: string,
  +selected?: ?boolean,
  +selectedTerminals?: ?iMap<string, iSet<string>>,
  +left?: ?number,
  +top?: ?number,
}

export const NodeContext: React.Context<?NodeContextProps> = React.createContext(
  null
)

export function useNodeContext(): NodeContextProps {
  const value = React.useContext(NodeContext)
  if (!value) throw new Error(`must be used in a descendant of a NodeContext`)
  return value
}

export type Props = {
  +children: React.Node,
  ...NodeContextProps,
}

const NodeContainer = ({
  id,
  selected,
  selectedTerminals,
  children,
  left,
  top,
}: Props): React.Node => {
  const {
    setSelectedNodes,
    addSelectedNodes,
    toggleSelectedNodes,
  } = React.useContext(NodesActionsContext)

  const handleMouseDown = React.useCallback(
    (event: SyntheticMouseEvent<any>) => {
      if (
        event.target instanceof Element &&
        findParentTerminalEl(event.target)
      ) {
        return
      }
      if (event.ctrlKey) toggleSelectedNodes([id])
      else if (event.shiftKey) addSelectedNodes([id])
      else setSelectedNodes([id])
    },
    [setSelectedNodes, addSelectedNodes, toggleSelectedNodes]
  )

  const value = React.useMemo(() => ({ id, selected, selectedTerminals }), [
    id,
    selected,
    selectedTerminals,
  ])
  return (
    <NodeContext.Provider value={value}>
      <div
        style={{ position: 'absolute', left, top }}
        onMouseDown={handleMouseDown}
        data-nodeid={id}
      >
        {children}
      </div>
    </NodeContext.Provider>
  )
}

export default NodeContainer
