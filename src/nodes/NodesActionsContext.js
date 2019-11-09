/**
 * @prettier
 */

import * as React from 'react'
import { createNodesRedux, type NodesActions } from './nodesRedux'

export default (React.createContext(
  createNodesRedux().actions
): React.Context<NodesActions>)
