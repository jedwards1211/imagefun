/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import Input from '@material-ui/core/Input'

import Slider from './Slider'

export type Props = {
  value: ?Array<string>,
  onChange: (value: Array<string>) => any,
}

const RGBXYMatrixInputs = ({ value, onChange }: Props): React.Node => {
  const matrix = Array.isArray(value) ? value : []
  return (
    <table>
      <thead>
        <tr>
          <th />
          <th>Red</th>
          <th>Green</th>
          <th>Blue</th>
          <th>Offset</th>
        </tr>
      </thead>
      <tbody>
        {[0, 1].map(row => (
          <tr key={row}>
            <th>{row === 0 ? 'x' : 'y'}</th>
            {[0, 1, 2, 3].map(col => (
              <td key={col}>
                <Input
                  inputProps={{
                    style: {
                      minWidth: 50,
                      height: 25,
                      fontSize: 20,
                      textAlign: 'center',
                    },
                    size: 10,
                  }}
                  type="text"
                  value={matrix[row * 4 + col]}
                  onChange={(e: SyntheticEvent<any>) => {
                    if (!onChange) return
                    const newMatrix = [...matrix]
                    newMatrix[row * 4 + col] = (e.target: any).value
                    onChange(newMatrix)
                  }}
                  onBlur={(e: SyntheticEvent<any>) => {
                    if (!onChange) return
                    const parsed = parseFloat((e.target: any).value)
                    const newMatrix = [...matrix]
                    newMatrix[row * 4 + col] = Number.isFinite(parsed)
                      ? String(parsed)
                      : '0'
                    onChange(newMatrix)
                  }}
                />
                <Slider
                  min={-2}
                  max={2}
                  value={parseFloat(matrix[row * 4 + col])}
                  onChange={(value: number) => {
                    if (!onChange) return
                    const newMatrix = [...matrix]
                    newMatrix[row * 4 + col] = String(value)
                    onChange(newMatrix)
                  }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default RGBXYMatrixInputs
