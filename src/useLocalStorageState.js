/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import { type Type } from 'flow-runtime'

export default function useLocalStorageState<S>(
  initValue: (() => S) | S,
  key: string,
  type: Type<any>
): [S, ((S => S) | S) => void] {
  const actualInitValue: S = React.useMemo((): S => {
    const str = localStorage.getItem(key)
    if (str) {
      const parsed = JSON.parse(str)
      if (type.accepts(parsed)) return parsed
    }
    return typeof initValue === 'function' ? (initValue: any)() : initValue
  }, [])
  const result = React.useState(actualInitValue)
  const [state] = result
  React.useEffect(
    () => localStorage.setItem(key, String(JSON.stringify(state))),
    [state]
  )
  return result
}
