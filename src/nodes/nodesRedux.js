// @flow

import {
  Map as iMap,
  Set as iSet,
  OrderedSet,
  Record,
  type RecordOf,
} from 'immutable'
import { mapValues } from 'lodash/fp'
import uuid from 'uuid'

import { type Direction } from './Direction'

export type Node = {
  +id: string,
  +kind: string,
  +props: Object,
  +left: number,
  +top: number,
  +inputWires?: ?iSet<string>,
  +outputWires?: ?iSet<string>,
}

export type NodeAndTerminal = {
  +node: string,
  +terminal: string,
}

export type Wire = {
  +id: string,
  +from: NodeAndTerminal,
  +to: NodeAndTerminal,
}

export type AddNode = {
  +kind: string,
  +props: Object,
  +left: number,
  +top: number,
}

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

export type ConnectWire = {
  +from: NodeAndTerminal,
  +to: NodeAndTerminal,
}
export type ConnectAction = {
  +type: string,
  +payload: $ReadOnlyArray<ConnectWire>,
}
export type DisconnectWire = {
  +from?: {
    +node: string,
    +terminal?: string,
  },
  +to?: {
    +node: string,
    +terminal?: string,
  },
}
export type DisconnectAction = {
  +type: string,
  +payload: $ReadOnlyArray<DisconnectWire>,
}
export type DeleteWiresAction = {
  +type: string,
  +payload: $ReadOnlyArray<string>,
}

export type ClearSelectionAction = {
  +type: string,
}
export type DeleteSelectedAction = {
  +type: string,
}

export type SetSelectedWiresAction = {
  +type: string,
  +payload: Iterable<string>,
}

export type TerminalPath = [string, Direction, string]
export type SetSelectedTerminalsAction = {
  +type: string,
  +payload: Iterable<TerminalPath>,
}
export type DisconnectTerminalsAction = {
  +type: string,
  +payload: $ReadOnlyArray<TerminalPath>,
}

export type Nodes = iMap<string, Node>

export type SelectedTerminals = iMap<string, iMap<string, iSet<string>>>

function* flattenSelectedTerminals(
  selectedTerminals: SelectedTerminals
): Iterable<[string, Direction, string]> {
  for (const [node, directions] of selectedTerminals) {
    for (const [direction, terminals] of directions) {
      if (direction !== 'input' && direction !== 'output') continue
      for (const terminal of terminals) yield [node, direction, terminal]
    }
  }
}

export type NodesStateFields = {
  +nodes: Nodes,
  +nodesOrder: OrderedSet<string>,
  +selectedNodes: iSet<string>,
  +selectedWires: iSet<string>,
  +selectedTerminals: SelectedTerminals,
  +wires: iMap<string, Wire>,
}

export type NodesState = RecordOf<NodesStateFields>
export const NodesStateRecord = Record({
  nodes: iMap(),
  nodesOrder: OrderedSet(),
  selectedNodes: iSet(),
  selectedWires: iSet(),
  selectedTerminals: iMap(),
  wires: iMap(),
})

export const initNodesState = (): NodesState => NodesStateRecord()

export const ADD_NODES = 'ADD_NODES'
export const UPDATE_NODES = 'UPDATE_NODES'
export const DELETE_NODES = 'DELETE_NODES'
export const DELETE_WIRES = 'DELETE_WIRES'
export const DISCONNECT_TERMINALS = 'DISCONNECT_TERMINALS'
export const DELETE_SELECTED = 'DELETE_SELECTED'
export const SET_SELECTED_NODES = 'SET_SELECTED_NODES'
export const ADD_SELECTED_NODES = 'ADD_SELECTED_NODES'
export const TOGGLE_SELECTED_NODES = 'TOGGLE_SELECTED_NODES'
export const SET_SELECTED_WIRES = 'SET_SELECTED_WIRES'
export const ADD_SELECTED_WIRES = 'ADD_SELECTED_WIRES'
export const TOGGLE_SELECTED_WIRES = 'TOGGLE_SELECTED_WIRES'
export const SET_SELECTED_TERMINALS = 'SET_SELECTED_TERMINALS'
export const ADD_SELECTED_TERMINALS = 'ADD_SELECTED_TERMINALS'
export const TOGGLE_SELECTED_TERMINALS = 'TOGGLE_SELECTED_TERMINALS'
export const CLEAR_SELECTION = 'CLEAR_SELECTION'
export const CONNECT = 'CONNECT'
export const DISCONNECT = 'DISCONNECT'

export type NodesActionTypes = {
  addNodes: string,
  updateNodes: string,
  deleteNodes: string,
  deleteWires: string,
  disconnectTerminals: string,
  deleteSelected: string,
  setSelectedNodes: string,
  addSelectedNodes: string,
  toggleSelectedNodes: string,
  setSelectedWires: string,
  addSelectedWires: string,
  toggleSelectedWires: string,
  setSelectedTerminals: string,
  addSelectedTerminals: string,
  toggleSelectedTerminals: string,
  clearSelection: string,
  connect: string,
  disconnect: string,
}

export type NodesActions = {
  addNodes: (...nodes: $ReadOnlyArray<AddNode>) => AddNodesAction,
  updateNodes: (...nodes: $ReadOnlyArray<UpdateNode>) => UpdateNodesAction,
  deleteNodes: (...nodes: $ReadOnlyArray<string>) => DeleteNodesAction,
  deleteWires: (...nodes: $ReadOnlyArray<string>) => DeleteWiresAction,
  disconnectTerminals: (
    ...nodes: $ReadOnlyArray<TerminalPath>
  ) => DisconnectTerminalsAction,
  deleteSelected: () => DeleteSelectedAction,
  setSelectedNodes: (nodes: Iterable<string>) => SetSelectedNodesAction,
  addSelectedNodes: (nodes: Iterable<string>) => SetSelectedNodesAction,
  toggleSelectedNodes: (nodes: Iterable<string>) => SetSelectedNodesAction,
  setSelectedWires: (wires: Iterable<string>) => SetSelectedWiresAction,
  addSelectedWires: (wires: Iterable<string>) => SetSelectedWiresAction,
  toggleSelectedWires: (wires: Iterable<string>) => SetSelectedWiresAction,
  setSelectedTerminals: (
    terminals: Iterable<TerminalPath>
  ) => SetSelectedTerminalsAction,
  addSelectedTerminals: (
    terminals: Iterable<TerminalPath>
  ) => SetSelectedTerminalsAction,
  toggleSelectedTerminals: (
    terminals: Iterable<TerminalPath>
  ) => SetSelectedTerminalsAction,
  clearSelection: () => ClearSelectionAction,
  connect: (...wires: $ReadOnlyArray<ConnectWire>) => ConnectAction,
  disconnect: (...wires: $ReadOnlyArray<DisconnectWire>) => DisconnectAction,
}

export type NodesAction =
  | AddNodesAction
  | UpdateNodesAction
  | DeleteNodesAction
  | DeleteWiresAction
  | DisconnectTerminalsAction
  | DeleteSelectedAction
  | SetSelectedNodesAction
  | SetSelectedWiresAction
  | SetSelectedTerminalsAction
  | ClearSelectionAction
  | ConnectAction
  | DisconnectAction

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
    deleteWires: DELETE_WIRES,
    disconnectTerminals: DISCONNECT_TERMINALS,
    deleteSelected: DELETE_SELECTED,
    setSelectedNodes: SET_SELECTED_NODES,
    addSelectedNodes: ADD_SELECTED_NODES,
    toggleSelectedNodes: TOGGLE_SELECTED_NODES,
    setSelectedWires: SET_SELECTED_WIRES,
    addSelectedWires: ADD_SELECTED_WIRES,
    toggleSelectedWires: TOGGLE_SELECTED_WIRES,
    setSelectedTerminals: SET_SELECTED_TERMINALS,
    addSelectedTerminals: ADD_SELECTED_TERMINALS,
    toggleSelectedTerminals: TOGGLE_SELECTED_TERMINALS,
    clearSelection: CLEAR_SELECTION,
    connect: CONNECT,
    disconnect: DISCONNECT,
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
    deleteWires: (...wires: $ReadOnlyArray<string>): DeleteWiresAction => ({
      type: actionTypes.deleteWires,
      payload: wires,
    }),
    disconnectTerminals: (
      ...terminals: $ReadOnlyArray<TerminalPath>
    ): DisconnectTerminalsAction => ({
      type: actionTypes.disconnectTerminals,
      payload: terminals,
    }),
    deleteSelected: (): DeleteSelectedAction => ({
      type: actionTypes.deleteSelected,
    }),
    setSelectedNodes: (nodes: Iterable<string>): SetSelectedNodesAction => ({
      type: actionTypes.setSelectedNodes,
      payload: nodes,
    }),
    addSelectedNodes: (nodes: Iterable<string>): SetSelectedNodesAction => ({
      type: actionTypes.addSelectedNodes,
      payload: nodes,
    }),
    toggleSelectedNodes: (nodes: Iterable<string>): SetSelectedNodesAction => ({
      type: actionTypes.toggleSelectedNodes,
      payload: nodes,
    }),
    setSelectedWires: (wires: Iterable<string>): SetSelectedWiresAction => ({
      type: actionTypes.setSelectedWires,
      payload: wires,
    }),
    addSelectedWires: (wires: Iterable<string>): SetSelectedWiresAction => ({
      type: actionTypes.addSelectedWires,
      payload: wires,
    }),
    toggleSelectedWires: (wires: Iterable<string>): SetSelectedWiresAction => ({
      type: actionTypes.toggleSelectedWires,
      payload: wires,
    }),
    setSelectedTerminals: (
      terminals: Iterable<TerminalPath>
    ): SetSelectedTerminalsAction => ({
      type: actionTypes.setSelectedTerminals,
      payload: terminals,
    }),
    addSelectedTerminals: (
      terminals: Iterable<TerminalPath>
    ): SetSelectedTerminalsAction => ({
      type: actionTypes.addSelectedTerminals,
      payload: terminals,
    }),
    toggleSelectedTerminals: (
      terminals: Iterable<TerminalPath>
    ): SetSelectedTerminalsAction => ({
      type: actionTypes.toggleSelectedTerminals,
      payload: terminals,
    }),
    clearSelection: (): ClearSelectionAction => ({
      type: actionTypes.clearSelection,
    }),
    connect: (...wires: $ReadOnlyArray<ConnectWire>): ConnectAction => ({
      type: actionTypes.connect,
      payload: wires,
    }),
    disconnect: (
      ...wires: $ReadOnlyArray<DisconnectWire>
    ): DisconnectAction => ({
      type: actionTypes.disconnect,
      payload: wires,
    }),
  }

  const reducer = (state: ?NodesState, action: NodesAction): NodesState => {
    if (!state) state = initNodesState()
    const {
      wires,
      nodes,
      nodesOrder,
      selectedNodes,
      selectedWires,
      selectedTerminals,
    } = state
    switch ((action: any).type) {
      case actionTypes.addNodes: {
        const { payload } = ((action: any): AddNodesAction)
        const newNodes = payload.map(node => ({ ...node, id: uuid() }))
        return state.merge({
          nodes: nodes.withMutations(nodes =>
            newNodes.forEach(node => nodes.set(node.id, node))
          ),
          nodesOrder: nodesOrder.union(newNodes.map(n => n.id)),
        })
      }
      case actionTypes.updateNodes: {
        const { payload } = ((action: any): UpdateNodesAction)
        return state.set(
          'nodes',
          nodes.withMutations(nodes =>
            payload.forEach(updates =>
              nodes.update(updates.id, node => ({ ...node, ...updates }))
            )
          )
        )
      }
      case actionTypes.deleteNodes: {
        const { payload } = ((action: any): DeleteNodesAction)
        return state.merge({
          nodes: nodes.withMutations(nodes =>
            payload.forEach(nodeId => nodes.delete(nodeId))
          ),
          nodesOrder: nodesOrder.subtract(payload),
          selectedNodes: selectedNodes.subtract(payload),
        })
      }
      case actionTypes.deleteWires: {
        const { payload } = ((action: any): DeleteWiresAction)
        return state.merge({
          nodes: nodes.withMutations((nodes: iMap<string, Node>) => {
            for (const wireId of payload) {
              const wire: ?Wire = wires.get(wireId)
              if (!wire) return
              nodes.update(
                wire.from.node,
                node =>
                  node && {
                    ...node,
                    outputWires: (node.outputWires || iSet()).delete(wireId),
                  }
              )
              nodes.update(
                wire.to.node,
                node =>
                  node && {
                    ...node,
                    inputWires: (node.inputWires || iSet()).delete(wireId),
                  }
              )
            }
          }),
          wires: wires.deleteAll(payload),
          selectedWires: selectedWires.subtract(payload),
        })
      }
      case actionTypes.disconnectTerminals: {
        const { payload } = ((action: any): DisconnectTerminalsAction)
        const wiresToDelete = []
        for (const [nodeId, direction, terminal] of payload) {
          const node: ?Node = nodes.get(nodeId)
          if (!node) continue
          const nodeWires =
            direction === 'input' ? node.inputWires : node.outputWires
          if (!nodeWires) continue
          for (const wireId of nodeWires) {
            const wire: ?Wire = wires.get(wireId)
            if (
              wire &&
              (direction === 'input' ? wire.to : wire.from).terminal ===
                terminal
            ) {
              wiresToDelete.push(wireId)
            }
          }
        }
        return reducer(state, actions.deleteWires(...wiresToDelete))
      }
      case actionTypes.deleteSelected: {
        let nextState = state
        if (state.selectedNodes.size)
          nextState = reducer(
            nextState,
            actions.deleteNodes(...state.selectedNodes)
          )
        if (state.selectedWires.size)
          nextState = reducer(
            nextState,
            actions.deleteWires(...state.selectedWires)
          )
        if (state.selectedTerminals.size)
          nextState = reducer(
            nextState,
            actions.disconnectTerminals(
              ...flattenSelectedTerminals(state.selectedTerminals)
            )
          )
        return nextState
      }
      case actionTypes.setSelectedNodes: {
        const { payload } = ((action: any): SetSelectedNodesAction)
        return state.merge({
          nodesOrder: nodesOrder.subtract(payload).union(payload),
          selectedNodes: iSet(payload).filter(id => nodes.has(id)),
          selectedWires: iSet(),
          selectedTerminals: iMap(),
        })
      }
      case actionTypes.addSelectedNodes: {
        const { payload } = ((action: any): SetSelectedNodesAction)
        return state.merge({
          nodesOrder: nodesOrder.subtract(payload).union(payload),
          selectedNodes: selectedNodes.union(
            iSet(payload).filter(id => nodes.has(id))
          ),
        })
      }
      case actionTypes.toggleSelectedNodes: {
        const { payload } = ((action: any): SetSelectedNodesAction)
        return state.merge({
          nodesOrder: nodesOrder.subtract(payload).union(payload),
          selectedNodes: selectedNodes.withMutations(
            (selectedNodes: iSet<string>) => {
              for (const node of payload) {
                if (selectedNodes.has(node)) selectedNodes.delete(node)
                else if (nodes.has(node)) selectedNodes.add(node)
              }
            }
          ),
        })
      }
      case actionTypes.setSelectedWires: {
        const { payload } = ((action: any): SetSelectedWiresAction)
        return state.merge({
          selectedWires: iSet(payload).filter(id => wires.has(id)),
          selectedNodes: iSet(),
          selectedTerminals: iMap(),
        })
      }
      case actionTypes.addSelectedWires: {
        const { payload } = ((action: any): SetSelectedWiresAction)
        return state.merge({
          selectedWires: selectedWires.union(
            iSet(payload).filter(id => wires.has(id))
          ),
        })
      }
      case actionTypes.toggleSelectedWires: {
        const { payload } = ((action: any): SetSelectedWiresAction)
        return state.merge({
          selectedWires: selectedWires.withMutations(
            (selectedWires: iSet<string>) => {
              for (const wire of payload) {
                if (selectedWires.has(wire)) selectedWires.delete(wire)
                else if (wires.has(wire)) selectedWires.add(wire)
              }
            }
          ),
        })
      }
      case actionTypes.setSelectedTerminals: {
        const { payload } = ((action: any): SetSelectedTerminalsAction)
        return state.merge({
          selectedTerminals: iMap().withMutations(
            (selectedTerminals: SelectedTerminals) => {
              for (const [node, direction, terminal] of payload) {
                selectedTerminals.updateIn(
                  [node, direction],
                  (terminals = iSet()) => terminals.add(terminal)
                )
              }
            }
          ),
          selectedNodes: iSet(),
          selectedWires: iSet(),
        })
      }
      case actionTypes.addSelectedTerminals: {
        const { payload } = ((action: any): SetSelectedTerminalsAction)
        return state.merge({
          selectedTerminals: selectedTerminals.withMutations(
            (selectedTerminals: SelectedTerminals) => {
              for (const [node, direction, terminal] of payload) {
                selectedTerminals.updateIn(
                  [node, direction],
                  (terminals = iSet()) => terminals.add(terminal)
                )
              }
            }
          ),
        })
      }
      case actionTypes.toggleSelectedTerminals: {
        const { payload } = ((action: any): SetSelectedTerminalsAction)
        return state.merge({
          selectedTerminals: selectedTerminals.withMutations(
            (selectedTerminals: SelectedTerminals) => {
              for (const path of payload) {
                if (selectedTerminals.hasIn(path)) {
                  selectedTerminals.deleteIn(path)
                } else {
                  const [node, direction, terminal] = path
                  selectedTerminals.updateIn(
                    [node, direction],
                    (terminals = iSet()) => terminals.add(terminal)
                  )
                }
              }
            }
          ),
        })
      }
      case actionTypes.clearSelection:
        return state.merge({
          selectedNodes: iSet(),
          selectedWires: iSet(),
          selectedTerminals: iMap(),
        })
      case actionTypes.connect: {
        const { payload } = ((action: any): ConnectAction)
        const wiresWithId = payload
          .map(({ from, to }) => ({
            id: JSON.stringify([
              from.node,
              from.terminal,
              to.node,
              to.terminal,
            ]),
            from,
            to,
          }))
          .filter(wire => !wires.has(wire.id))
        return state.merge({
          nodes: nodes.withMutations(nodes =>
            wiresWithId.forEach((wire: Wire) => {
              const { from, to } = wire
              nodes.update(from.node, node => ({
                ...node,
                outputWires: (node.outputWires || iSet()).add(wire.id),
              }))
              nodes.update(to.node, node => ({
                ...node,
                inputWires: (node.inputWires || iSet()).add(wire.id),
              }))
            })
          ),
          wires: wires.withMutations(wires =>
            wiresWithId.forEach(wire => wires.set(wire.id, wire))
          ),
        })
      }
      case actionTypes.disconnect: {
        const { payload } = ((action: any): DisconnectAction)
        const mutableNodes = nodes.asMutable()
        const mutableWires = wires.asMutable()

        for (const { from, to } of payload) {
          if (from && to) {
            const wireId = JSON.stringify([
              from.node,
              from.terminal,
              to.node,
              to.terminal,
            ])
            mutableWires.delete(wireId)
            mutableNodes.update(from.node, node => ({
              ...node,
              outputWires: (node.outputWires || iSet()).delete(wireId),
            }))
            mutableNodes.update(to.node, node => ({
              ...node,
              inputWires: (node.inputWires || iSet()).delete(wireId),
            }))
          } else if (from) {
            const node = nodes.get(from.node)
            if (node && node.outputWires) {
              const { outputWires, ...rest } = node
              if (from.terminal) {
                const removed = outputWires.filter(
                  wireId => wires.get(wireId)?.from.terminal === from.terminal
                )
                mutableWires.deleteAll(removed)
                mutableNodes.set(from.node, {
                  ...rest,
                  outputWires: outputWires.subtract(removed),
                })
              } else {
                mutableWires.deleteAll(outputWires)
                mutableNodes.set(from.node, rest)
              }
            }
          } else if (to) {
            const node = nodes.get(to.node)
            if (node && node.inputWires) {
              const { inputWires, ...rest } = node
              if (to.terminal) {
                const removed = inputWires.filter(
                  wireId => wires.get(wireId)?.from.terminal === to.terminal
                )
                mutableWires.deleteAll(removed)
                mutableNodes.set(to.node, {
                  ...rest,
                  inputWires: inputWires.subtract(removed),
                })
              } else {
                mutableWires.deleteAll(inputWires)
                mutableNodes.set(to.node, rest)
              }
            }
          }
        }

        return state.merge({
          nodes: mutableNodes.asImmutable(),
          wires: mutableWires.asImmutable(),
        })
      }
    }
    return state
  }

  return { actionTypes, actions, reducer }
}
