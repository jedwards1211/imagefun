/**
 * @flow
 * @prettier
 */

/* eslint-env browser */

import { useCallback } from 'react'

type DragHandler = (event: MouseEvent | SyntheticMouseEvent<any>) => any

/**
 * A hook for handling mouse drags.  It creates an onMouseDown handler;
 * after mouse down it adds mousemove/mouseup listeners to document.body, so
 * that it can intercept events even if the mouse moves out of the pressed
 * element.  Once the mouse is released it removes the listeners from
 * document.body.
 *
 * @param {Function} handler - your callback for receiving mousedown/mousemove/
 * mouseup events.  The mousedown event will be a React SyntheticMouseEvent but
 * the mousemove and mouseup events will be DOM MouseEvents since they're coming
 * from document.body.
 *
 * @return {Function} an onMouseDown handler to pass to the component you want to
 * respond to drags.
 */
export default function useMouseDrag(
  handler: DragHandler
): (SyntheticMouseEvent<any>) => any {
  return useCallback(
    (e: SyntheticMouseEvent<any>) => {
      if (typeof document !== 'object') return
      const { body } = document
      if (!body) return

      function handleMouseMove(e: MouseEvent) {
        handler(e)
      }
      function end(e: MouseEvent) {
        body.removeEventListener('mousemove', handleMouseMove, true)
        body.removeEventListener('mouseup', end)
        handler(e)
      }

      body.addEventListener('mousemove', handleMouseMove, true)
      body.addEventListener('mouseup', end)

      handler(e)
    },
    [handler]
  )
}
