// @flow

import * as React from 'react'
import NodeBox from './NodeBox'
import Slider from '../Slider'

import NodesActionsContext from './NodesActionsContext'

import Terminal from './Terminal'

import { withStyles } from '@material-ui/core/styles'
import { type Theme } from '../theme'

import classNames from 'classnames'

type Classes<Styles> = $Call<<T>((any) => T) => { [$Keys<T>]: string }, Styles>

const styles = (theme: Theme) => ({
  root: {
    width: 200,
    display: 'flex',
    alignItems: 'center',
  },
  selected: {},
  slider: {
    flex: '1 1 auto',
    margin: theme.spacing(1),
  },
  terminal: {
    marginRight: -theme.spacing(0.5),
  },
  value: {
    width: theme.spacing(6),
    overflow: 'hidden',
    padding: theme.spacing(1),
    color: 'white',
    boxShadow: `0 0 0 1px hsl(0, 0%, 30%), 0 0 0 2px hsl(0, 0%, 50%)`,
    background: `linear-gradient(to bottom, #aaa, #777)`,
    borderRadius: 4,
    margin: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    '$selected &': {
      boxShadow: `0 0 0 1.5px hsl(0, 0%, 30%), 0 0 0 3px hsl(78, 100%, 30%)`,
      background: `linear-gradient(to bottom, hsl(78, 20%, 50%), #666)`,
    },
  },
})

export type Props = {
  +id: string,
  +props: { +value?: number, +min?: number, +max?: number },
  +selected?: ?boolean,
  +classes: Classes<typeof styles>,
}

const SliderNode = ({ selected, id, props, classes }: Props): React.Node => {
  const { value, min, max } = props || {}
  const { updateNodes } = React.useContext(NodesActionsContext)
  const handleChange = React.useCallback(
    value => updateNodes([{ id, props: { ...props, value } }]),
    [id, props, updateNodes]
  )
  React.useEffect(
    () => {
      if (
        !Number.isFinite(value) ||
        !Number.isFinite(min) ||
        !Number.isFinite(max)
      ) {
        updateNodes([
          { id, props: { min: min ?? -10, max: max ?? 10, value: 0 } },
        ])
      }
    },
    [id, props, updateNodes]
  )
  return (
    <NodeBox
      selected={selected}
      classes={{
        root: classNames(classes.root, { [classes.selected]: selected }),
      }}
    >
      <div className={classes.value}>{value}</div>
      <Slider
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        classes={{ root: classes.slider }}
      />
      <Terminal
        direction="output"
        name="value"
        classes={{ root: classes.terminal }}
      />
    </NodeBox>
  )
}

const SliderNodeWithStyles = withStyles(styles)(SliderNode)

export default SliderNodeWithStyles
