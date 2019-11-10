/**
 * @flow
 * @prettier
 */

import * as React from 'react'

export type Props = {
  +children?: ?React.Node,
  ...,
}

export const GLContext: React.Context<?WebGLRenderingContext> = React.createContext(
  null
)

export function useGL(): WebGLRenderingContext {
  const context = React.useContext(GLContext)
  if (!context) throw new Error('failed to get canvas context')
  return context
}

type State = {
  gl: ?WebGLRenderingContext,
  error: ?Error,
}

export default class GLCanvas extends React.Component<Props, State> {
  state: State = { gl: null, error: null }

  static getDerivedStateFromError(error: Error): $Shape<State> {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  _canvasRef = (canvas: ?HTMLCanvasElement) => {
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (gl && this.state.gl !== gl) this.setState({ gl })
  }

  render(): React.Node {
    const { children, ...props } = this.props
    const { gl, error } = this.state
    if (error)
      return (
        <div style={{ overflow: 'auto' }}>
          <pre style={{ color: 'red' }}>{error.stack}</pre>
        </div>
      )
    return (
      <React.Fragment>
        <canvas {...props} ref={this._canvasRef} />
        {gl && <GLContext.Provider value={gl}>{children}</GLContext.Provider>}
      </React.Fragment>
    )
  }
}
