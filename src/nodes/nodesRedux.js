// @flow

import { Map as iMap, Set as iSet, OrderedSet } from 'immutable'
import { mapValues } from 'lodash/fp'
import uuid from 'uuid'

export type Node = {
  +id: string,
  +kind: string,
  +props: Object,
  +left: number,
  +top: number,
}

export type AddNode = $Diff<Node, { +id: string }>
export type AddNodesAction = {
  +type: string,
  +payload: $ReadOnlyArray<AddNode>,
}
export type UpdateNode = {
  +id: string,
  +kind?: string,
  +props?: Object,
  +left?: number,
  +top?: number,
}
export type UpdateNodesAction = {
  +type: string,
  +payload: $ReadOnlyArray<UpdateNode>,
}
export type DeleteNodesAction = {
  +type: string,
  +payload: $ReadOnlyArray<string>,
}
export type SetSelectedNodesAction = {
  +type: string,
  +payload: Iterable<string>,
}

export type NodesState = {
  +nodes: iMap<string, Node>,
  +nodesOrder: OrderedSet<string>,
  +selectedNodes: iSet<string>,
}

export const initNodesState = (): NodesState => ({
  nodes: iMap(),
  nodesOrder: OrderedSet(),
  selectedNodes: iSet(),
})

export const ADD_NODES = 'ADD_NODES'
export const UPDATE_NODES = 'UPDATE_NODES'
export const DELETE_NODES = 'DELETE_NODES'
export const SET_SELECTED_NODES = 'SET_SELECTED_NODES'

export type NodesActionTypes = {
  addNodes: string,
  updateNodes: string,
  deleteNodes: string,
  setSelectedNodes: string,
}

export type NodesActions = {
  addNodes: (...nodes: $ReadOnlyArray<AddNode>) => AddNodesAction,
  updateNodes: (...nodes: $ReadOnlyArray<UpdateNode>) => UpdateNodesAction,
  deleteNodes: (...nodes: $ReadOnlyArray<string>) => DeleteNodesAction,
  setSelectedNodes: (nodes: Iterable<string>) => SetSelectedNodesAction,
}

export type NodesAction = $ObjMap<NodesActions, <A>(() => A) => A>

export type NodesRedux = {
  actionTypes: NodesActionTypes,
  actions: NodesActions,
  reducer: (state: ?NodesState, action: NodesAction) => NodesState,
}

export function createNodesRedux(
  customizeActionType: string => string = t => t
): NodesRedux {
  const actionTypes = mapValues(customizeActionType)({
    addNodes: ADD_NODES,
    updateNodes: UPDATE_NODES,
    deleteNodes: DELETE_NODES,
    setSelectedNodes: SET_SELECTED_NODES,
  })

  const actions = {
    addNodes: (...nodes: $ReadOnlyArray<AddNode>): AddNodesAction => ({
      type: actionTypes.addNodes,
      payload: nodes,
    }),
    updateNodes: (...nodes: $ReadOnlyArray<UpdateNode>): UpdateNodesAction => ({
      type: actionTypes.updateNodes,
      payload: nodes,
    }),
    deleteNodes: (...nodes: $ReadOnlyArray<string>): DeleteNodesAction => ({
      type: actionTypes.deleteNodes,
      payload: nodes,
    }),
    setSelectedNodes: (nodes: Iterable<string>): SetSelectedNodesAction => ({
      type: actionTypes.setSelectedNodes,
      payload: nodes,
    }),
  }

  const reducer = (state: ?NodesState, action: NodesAction): NodesState => {
    if (!state) state = initNodesState()
    const { nodes, nodesOrder, selectedNodes } = state
    switch ((action: any).type) {
      case actionTypes.addNodes: {
        const { payload } = ((action: any): AddNodesAction)
        const newNodes = payload.map(node => ({ ...node, id: uuid() }))
        return {
          nodes: nodes.withMutations(nodes =>
            newNodes.forEach(node => nodes.set(node.id, node))
          ),
          nodesOrder: nodesOrder.union(newNodes.map(n => n.id)),
          selectedNodes,
        }
      }
      case actionTypes.updateNodes: {
        const { payload } = ((action: any): UpdateNodesAction)
        return {
          nodes: nodes.withMutations(nodes =>
            payload.forEach(updates =>
              nodes.update(updates.id, node => ({ ...node, ...updates }))
            )
          ),
          nodesOrder,
          selectedNodes,
        }
      }
      case actionTypes.deleteNodes: {
        const { payload } = ((action: any): DeleteNodesAction)
        return {
          nodes: nodes.withMutations(nodes =>
            payload.forEach(nodeId => nodes.delete(nodeId))
          ),
          nodesOrder: nodesOrder.subtract(payload),
          selectedNodes: selectedNodes.subtract(payload),
        }
      }
      case actionTypes.setSelectedNodes: {
        const { payload } = ((action: any): SetSelectedNodesAction)
        return {
          nodes,
          nodesOrder: nodesOrder.subtract(payload).union(payload),
          selectedNodes: iSet(payload).filter(id => nodes.has(id)),
        }
      }
    }
    return state
  }

  return { actionTypes, actions, reducer }
}
