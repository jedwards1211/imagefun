/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { type Theme } from '../theme'
import Terminal from './Terminal'
import NodeBox from './NodeBox'

type Classes<Styles> = $Call<<T>((any) => T) => { [$Keys<T>]: string }, Styles>

const styles = (theme: Theme) => ({
  root: {},
  selected: {},
  inputs: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  input: {
    display: 'flex',
    alignItems: 'center',
  },
  inputTerminal: {
    marginLeft: -4 - theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  content: {
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
  nameVertical: {},
  name: {
    ...theme.typography.h6,
    display: 'inline-block',
    '&:not($nameVertical)': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    '&$nameVertical': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      writingMode: 'vertical-rl',
      textOrientation: 'mixed',
      transform: 'rotate(180deg)',
    },
  },
  outputs: {
    padding: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  output: {
    display: 'flex',
    alignItems: 'center',
  },
  outputTerminal: {
    marginLeft: theme.spacing(1),
    marginRight: -4 - theme.spacing(1),
  },
})

export type Props = {
  +id: string,
  +name: string,
  +inputs?: ?$ReadOnlyArray<Input>,
  +outputs?: ?$ReadOnlyArray<Output>,
  +children?: ?React.Node,
  +classes: Classes<typeof styles>,
  +selected?: ?boolean,
}

export type Input = {
  +name: string,
}

export type Output = {
  +name: string,
}

const DefaultNode = ({
  classes,
  id,
  name,
  inputs,
  outputs,
  children,
  selected,
}: Props): React.Node => {
  const nameVertical =
    (inputs && inputs.length > 3) || (outputs && outputs.length > 3)
  return (
    <NodeBox
      selected={selected}
      classes={{ root: classes.root, selected: classes.selected }}
    >
      {inputs && (
        <div className={classes.inputs}>
          {inputs.map(({ name }) => (
            <div key={name} className={classes.input}>
              <Terminal
                name={name}
                direction="input"
                side="left"
                classes={{
                  root: classes.inputTerminal,
                }}
              />
              {name}
            </div>
          ))}
        </div>
      )}
      <div className={classes.content}>
        {children ?? (
          <div
            className={classNames(classes.name, {
              [classes.nameVertical]: nameVertical,
            })}
          >
            {name}
          </div>
        )}
      </div>
      {outputs && (
        <div className={classes.outputs}>
          {outputs.map(({ name }) => (
            <div key={name} className={classes.output}>
              {name}
              <Terminal
                name={name}
                direction="output"
                side="right"
                classes={{
                  root: classes.outputTerminal,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </NodeBox>
  )
}

const DefaultNodeWithStyles = withStyles(styles)(DefaultNode)

export default DefaultNodeWithStyles
