/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { type Theme } from '../theme'

type Classes<Styles> = $Call<<T>((any) => T) => { [$Keys<T>]: string }, Styles>

const styles = (theme: Theme) => ({
  selected: {},
  root: {
    ...theme.typography.body2,
    userSelect: 'none',
    padding: theme.spacing(0.25),
    borderRadius: 4,
    background: `linear-gradient(to bottom, #eee, #ddd)`,
    boxShadow: `0 0 0 1.5px hsl(0, 0%, 100%), 0 0 0 3px hsl(0, 0%, 50%), 0 2px 10px 0px rgba(0, 0, 0, 0.35)`,
    display: 'inline-flex',
    '&$selected': {
      color: 'hsl(78, 100%, 20%)',
      boxShadow: `0 0 0 1.5px hsl(0, 0%, 100%), 0 0 0 3px hsl(78, 100%, 30%), 0 2px 10px 0px rgba(0, 0, 0, 0.35)`,
      background: `linear-gradient(to bottom, hsl(78, 90%, 80%), hsl(78, 50%, 70%))`,
    },
  },
})

export type Props = {
  +children?: ?React.Node,
  +selected?: ?boolean,
  +classes: Classes<typeof styles>,
}

const NodeBox = ({
  classes,
  selected,
  children,
  ...props
}: Props): React.Node => (
  <div
    className={classNames(classes.root, { [classes.selected]: selected })}
    {...props}
  >
    {children}
  </div>
)

const NodeBoxWithStyles = withStyles(styles)(NodeBox)

export default NodeBoxWithStyles
