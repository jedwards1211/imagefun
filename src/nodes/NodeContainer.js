/**
 * @prettier
 */

import * as React from 'react'

export type NodeContextProps = {
  +id: string,
  +selected: boolean,
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

export type Props = NodeContextProps & {
  +children: React.Node,
}

const NodeContainer = ({
  id,
  selected,
  children,
  left,
  top,
}: Props): React.Node => {
  const value = React.useMemo(() => ({ id, selected }), [id, selected])
  return (
    <NodeContext.Provider value={value}>
      <div style={{ position: 'absolute', left, top }}>{children}</div>
    </NodeContext.Provider>
  )
}

export default NodeContainer
