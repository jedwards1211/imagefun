/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'

const height = 30
const trackHeight = 6
const knobSize = 10

const styles = (theme: any) => ({
  root: {
    position: 'relative',
    height,
    minWidth: 50,
  },
  track: {
    position: 'absolute',
    top: (height - trackHeight) / 2,
    left: 0,
    right: 0,
    height: trackHeight,
    borderRadius: trackHeight,
    backgroundColor: 'lightgray',
  },
  knobHolder: {
    position: 'absolute',
    top: '50%',
    width: 0,
    height: 0,
  },
  fill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.primary.main,
  },
  knob: {
    position: 'absolute',
    top: -knobSize / 2,
    left: -knobSize / 2,
    height: knobSize,
    width: knobSize,
    borderRadius: knobSize,
    backgroundColor: theme.palette.primary.main,
    transform: 'scale(1)',
    transition: 'transform linear 0.1s',
    '$root:hover &': {
      transform: 'scale(1.5)',
    },
  },
})

type Classes<Styles> = $Call<<T>((any) => T) => { [$Keys<T>]: string }, Styles>

export type Props = {
  +classes: Classes<typeof styles>,
  +value: number,
  +onChange?: ?(value: number) => any,
  +min: number,
  +max: number,
}

const Slider = ({ value, onChange, min, max, classes }: Props): React.Node => {
  const fzero = Math.max(0, Math.min(100, (-min / (max - min)) * 100))
  const fvalue = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
  const rootRef = React.useRef()
  const onChangeRef = React.useRef()
  onChangeRef.current = onChange
  const handleMouse = React.useCallback((e: SyntheticMouseEvent<any>) => {
    const slider = rootRef.current
    const onChange = onChangeRef.current
    if (!onChange || !slider) return
    const rect = slider.getBoundingClientRect()
    const f = (e.clientX - rect.x) / rect.width
    const rf = 1 - f
    onChange(rf * min + f * max)
  }, [])
  const handleRootMouseDown = React.useCallback(
    (e: SyntheticMouseEvent<any>) => {
      e.preventDefault()
      e.stopPropagation()
      handleMouse(e)

      const handleMouseUp = (e: SyntheticMouseEvent<any>) => {
        e.stopPropagation()
        window.removeEventListener('mousemove', handleMouse, true)
        window.removeEventListener('mouseup', handleMouseUp, true)
      }

      window.addEventListener('mousemove', handleMouse, true)
      window.addEventListener('mouseup', handleMouseUp, true)
    },
    []
  )
  return (
    <div
      className={classes.root}
      onMouseDown={handleRootMouseDown}
      ref={(rootRef: any)}
    >
      <div className={classes.track}>
        <div
          className={classes.fill}
          style={{
            left: `${Math.min(fzero, fvalue)}%`,
            width: `${Math.max(fzero, fvalue) - Math.min(fzero, fvalue)}%`,
          }}
        />
      </div>
      <div className={classes.knobHolder} style={{ left: `${fvalue}%` }}>
        <div className={classes.knob} />
      </div>
    </div>
  )
}

export default withStyles(styles)(Slider)
