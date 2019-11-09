/**
 * @flow
 * @prettier
 */

import { useRef } from 'react'

/**
 * Gives you a persistent object from useRef() that you can tack whatever
 * persistent local state onto that you need.  It's handier than having to
 * use .current all over the place.
 * If you pass an argument, its props are assigned to the stash object, so
 * you can use this to update values on each render if desired.
 */
export default function useStash<Props: Object>(
  props: $Shape<Props> = {}
): Props {
  const ref = useRef(props)
  return Object.assign(ref.current, props)
}
