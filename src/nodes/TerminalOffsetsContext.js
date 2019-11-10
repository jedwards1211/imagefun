// @flow

import * as React from 'react'
import EventEmitter from '@jcoreio/typed-event-emitter'
import { Map as iMap } from "immutable"
import { useOnEvent } from "../hooks/useOnEvent"
import { type Direction } from "./Direction"

export type TerminalOffsetsEvents = {
  [terminalId: string]: [{left: number, top: number}],
}

export class TerminalOffsetsStore extends EventEmitter<TerminalOffsetsEvents> {
  offsets: iMap<string, iMap<string, iMap<string, { top: number, left: number }>>> = iMap()

  setOffset(node: string, direction: Direction, terminal: string, top: number, left: number) {
    const existing = this.getOffset(node, direction, terminal)
    if (existing?.left === left && existing?.top === top) return
    const offset = {left, top}
    this.offsets = this.offsets.setIn([node, direction, terminal], offset)
    this.emit(JSON.stringify([node, direction, terminal]), offset)
  }

  getOffset(node: string, direction: Direction, terminal: string): ?{top: number, left: number} {
    return this.offsets.getIn([node, direction, terminal])
  }
}

export const TerminalOffsetsContext: React.Context<TerminalOffsetsStore> = React.createContext(new TerminalOffsetsStore())

export type TerminalOffsetsProviderProps = {
  +children: React.Node,
}

export const TerminalOffsetsProvider = ({children}: TerminalOffsetsProviderProps): React.Node => {
  const storeRef = React.useRef()
  if (!storeRef.current) storeRef.current = new TerminalOffsetsStore()
  return (
    <TerminalOffsetsContext.Provider value={storeRef.current}>
      {children}
    </TerminalOffsetsContext.Provider>
  )
}

export function useSetTerminalOffset(): (node: string, direction: Direction, terminal: string, left: number, right: number) => any {
  const context = React.useContext(TerminalOffsetsContext)
  return context.setOffset.bind(context)
}

export function useTerminalOffset(node: string, direction: Direction, terminal: string): ?{left: number, top: number} {
  const context = React.useContext(TerminalOffsetsContext)
  const [offset, setOffset] = React.useState(context.getOffset(node, direction, terminal))
  const event = React.useMemo(() => JSON.stringify([node, direction, terminal]), [node, direction, terminal])
  useOnEvent((TerminalOffsetsContext: any), event, setOffset)
  React.useEffect(() => {
    setOffset(context.getOffset(node, direction, terminal))
  }, [node, direction, terminal])
  return offset
}
