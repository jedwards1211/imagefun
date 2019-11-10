/**
 * @flow
 * @prettier
 */

import EventEmitter from '@jcoreio/typed-event-emitter'
import * as React from 'react'

export function useOnEvent<Events: Object, Event: $Keys<Events>>(
  context: React.Context<EventEmitter<Events>>,
  event: Event,
  callback: (...$ElementType<Events, Event>) => any
) {
  const eventEmitter = React.useContext(context)
  React.useEffect(
    (): (() => any) => {
      eventEmitter.on(event, callback)
      return () => {
        eventEmitter.removeListener(event, callback)
      }
    },
    [event, callback]
  )
}
