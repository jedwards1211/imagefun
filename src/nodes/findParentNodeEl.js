// @flow

export default function findParentNodeEl(el: ?Element): ?Element {
  while (el && el !== document.body && !el.getAttribute('d-nodeid')) {
    el = el.parentElement
  }
  return el === document.body ? null : el
}
