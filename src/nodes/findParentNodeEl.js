// @flow

export default function findParentNodeEl(el: ?Element): ?Element {
  while (el && el !== document.body && !el.getAttribute('data-nodeid')) {
    el = el.parentElement
  }
  return el === document.body ? null : el
}

export function findParentNodeId(el: ?Element): ?string {
  const node = findParentNodeEl(el)
  return node ? node.getAttribute('data-nodeid') : null
}
