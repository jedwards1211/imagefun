// @flow

import findParentNodeEl from './findParentNodeEl'
import { type Direction } from './Direction'

export default function findParentTerminalEl(el: ?Element): ?Element {
  while (el && el !== document.body && !el.getAttribute('data-terminalname')) {
    el = el.parentElement
  }
  return el === document.body ? null : el
}

export function findParentTerminalProps(
  el: ?Element
): ?{ node: string, direction: Direction, terminal: string } {
  const terminal = findParentTerminalEl(el)
  if (!terminal) return null
  const node = findParentNodeEl(terminal)
  if (!node) return null
  const nodeId = node.getAttribute('data-nodeid')
  const direction = terminal.getAttribute('data-terminaldirection')
  const terminalName = terminal.getAttribute('data-terminalname')
  if (
    !nodeId ||
    (direction !== 'input' && direction !== 'output') ||
    !terminalName
  )
    return null
  return {
    node: nodeId,
    direction,
    terminal: terminalName,
  }
}
