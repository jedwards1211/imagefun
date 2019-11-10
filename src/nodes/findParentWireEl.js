// @flow

export default function findParentWireEl(el: ?Element): ?Element {
  while (el && el !== document.body && !el.getAttribute('data-wireid')) {
    el = el.parentElement
  }
  return el === document.body ? null : el
}

export function findParentWireId(el: ?Element): ?string {
  const wire = findParentWireEl(el)
  return wire ? wire.getAttribute('data-wireid') : null
}
