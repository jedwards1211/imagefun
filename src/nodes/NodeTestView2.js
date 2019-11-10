/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import DefaultNode from './DefaultNode'
import {
  createNodesRedux,
  type NodesState,
  NodesStateRecord,
} from './nodesRedux'
import NodesActionsContext from './NodesActionsContext'
import NodesView from './NodesView'
import { bindActionCreators } from 'redux'
import { Map as iMap, OrderedSet } from 'immutable'
import uuid from 'uuid'

export type Props = {}

const inputs = [
  { name: 'image' },
  { name: 'amount' },
  { name: 'span' },
  { name: 'rotate' },
]
const outputs = [{ name: 'image' }]

const EffectNode = props => (
  <DefaultNode {...props} name="effect" inputs={inputs} outputs={outputs} />
)

const nodeKinds = {
  effect: EffectNode,
}

const { actions, reducer } = createNodesRedux()

const initNodes = [
  { id: uuid(), kind: 'effect', props: {}, left: 100, top: 100 },
  { id: uuid(), kind: 'effect', props: {}, left: 500, top: 300 },
]

const initState: NodesState = reducer(
  NodesStateRecord({
    nodes: iMap(initNodes.map(node => [node.id, node])),
    nodesOrder: OrderedSet(initNodes.map(n => n.id)),
  }),
  actions.connect({
    from: { node: initNodes[0].id, terminal: 'image' },
    to: { node: initNodes[1].id, terminal: 'image' },
  })
)

const NodeTestView = (props: Props): React.Node => {
  const [state, dispatch] = React.useReducer(reducer, initState)

  const boundActions = React.useMemo(
    () => bindActionCreators(actions, dispatch),
    [dispatch]
  )

  return (
    <NodesActionsContext.Provider value={boundActions}>
      <NodesView
        state={state}
        nodeKinds={nodeKinds}
        width={1000}
        height={1000}
      />
    </NodesActionsContext.Provider>
  )
}

export default NodeTestView