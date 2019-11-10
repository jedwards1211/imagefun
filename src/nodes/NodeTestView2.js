/**
 * @flow
 * @prettier
 */

import { createStore, applyMiddleware } from 'redux'
import {
  Provider as StoreProvider,
  useSelector,
  useDispatch,
} from 'react-redux'
import reduxLogger from 'redux-logger'
import * as React from 'react'
import DefaultNode from './DefaultNode'
import {
  createNodesRedux,
  type NodesState,
  NodesStateRecord,
  NodeRecord,
} from './nodesRedux'
import NodesActionsContext from './NodesActionsContext'
import NodesView from './NodesView'
import { bindActionCreators } from 'redux'
import { Map as iMap, OrderedSet } from 'immutable'
import uuid from 'uuid'

import SliderNode from './SliderNode'

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
  slider: SliderNode,
}

const { actions, reducer } = createNodesRedux()

const initNodes = [
  { id: uuid(), kind: 'effect', props: {}, left: 100, top: 100 },
  { id: uuid(), kind: 'effect', props: {}, left: 500, top: 300 },
  { id: uuid(), kind: 'effect', props: {}, left: 200, top: 400 },
  { id: uuid(), kind: 'effect', props: {}, left: 300, top: 600 },
  { id: uuid(), kind: 'slider', props: {}, left: 100, top: 300 },
].map(NodeRecord)

const initState: NodesState = reducer(
  NodesStateRecord({
    nodes: iMap(initNodes.map(node => [node.id, node])),
    nodesOrder: OrderedSet(initNodes.map(n => n.id)),
  }),
  actions.connect([
    {
      from: { node: initNodes[0].id, terminal: 'image' },
      to: { node: initNodes[1].id, terminal: 'image' },
    },
  ])
)

const NodeTestView = (props: Props): React.Node => {
  const state = useSelector(state => state)
  const dispatch = useDispatch()

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

const store = createStore(reducer, initState, applyMiddleware(reduxLogger))

const NodeTestView2 = (props: Props) => (
  <StoreProvider store={store}>
    <NodeTestView {...props} />
  </StoreProvider>
)

export default NodeTestView2
