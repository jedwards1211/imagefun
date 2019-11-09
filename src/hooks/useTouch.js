/**
 * @flow
 * @prettier
 */

/* eslint-env browser */

import { useCallback } from 'react'
import useStash from './useStash'

import { pick } from 'lodash'

export type TouchCopy = {
  identifier: number,
  screenX: number,
  screenY: number,
  clientX: number,
  clientY: number,
  pageX: number,
  pageY: number,
  target: EventTarget,
  radiusX?: number,
  radiusY?: number,
  rotationAngle?: number,
  force?: number,
}

function copyTouch(touch: Touch): TouchCopy {
  return pick(
    touch,
    'identifier',
    'screenX',
    'screenY',
    'clientX',
    'clientY',
    'pageX',
    'pageY',
    'target',
    'radiusX',
    'radiusY',
    'rotationAngle',
    'force'
  )
}

type Props = {
  onTouchStart: (SyntheticTouchEvent<any>) => any,
  onTouchMove: (SyntheticTouchEvent<any>) => any,
  onTouchEnd: (SyntheticTouchEvent<any>) => any,
  onTouchCancel: (SyntheticTouchEvent<any>) => any,
}

type TouchHandler = (
  event: SyntheticTouchEvent<any>,
  touches: Map<number, TouchCopy>
) => any

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
export default function useTouch(handler: TouchHandler): Props {
  const stash = useStash({ handler })
  const touches: Map<number, TouchCopy> =
    stash.touches || (stash.touches = new Map())
  const onTouchStart = useCallback((e: SyntheticTouchEvent<any>) => {
    const { changedTouches } = e
    for (let i = 0; i < changedTouches.length; i++) {
      const touch = changedTouches[i]
      touches.set(touch.identifier, copyTouch(touch))
    }
    stash.handler(e, touches)
  })
  const onTouchEnd = useCallback((e: SyntheticTouchEvent<any>) => {
    const { changedTouches } = e
    for (let i = 0; i < changedTouches.length; i++) {
      const touch = changedTouches[i]
      touches.delete(touch.identifier)
    }
    stash.handler(e, touches)
  })

  return {
    onTouchStart,
    onTouchMove: onTouchStart,
    onTouchEnd,
    onTouchCancel: onTouchEnd,
  }
}
