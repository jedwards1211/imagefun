/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import { styled } from '@material-ui/styles'
import {
  compose,
  display,
  flexbox,
  sizing,
  shadows,
  palette,
} from '@material-ui/system'
import Typography from '@material-ui/core/Typography'

const Box = styled('div')(
  compose(
    display,
    sizing,
    shadows,
    flexbox,
    palette
  )
)

export type Props = {
  size: number,
  value: ?string,
  onChange?: ?(value: ?string) => any,
  onLoad?: ?(HTMLImageElement) => any,
}

const handleDragOver = (event: SyntheticEvent<any>) => {
  event.preventDefault()
  ;(event: any).dataTransfer.dropEffect = 'copy'
}

const ImageBin = ({ size, value, onChange, onLoad }: Props): React.Node => {
  const imgRef = React.useRef()
  const handleLoad = React.useCallback(() => {
    if (onLoad && imgRef.current) onLoad(imgRef.current)
  })
  let content
  if (value) {
    content = (
      <img
        key={value}
        width={size}
        height={size}
        src={value}
        ref={imgRef}
        onLoad={handleLoad}
      />
    )
  } else {
    content = (
      <Box
        height={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h6">Drop image here</Typography>
      </Box>
    )
  }
  const handleDrop = React.useCallback(
    (e: SyntheticEvent<any>) => {
      e.preventDefault()
      const {
        dataTransfer: { items },
      } = (e: any)
      if (!items || !onChange) return
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (
          item.kind !== 'file' ||
          !item.type ||
          !item.type.startsWith('image')
        ) {
          continue
        }
        onChange(URL.createObjectURL(item.getAsFile()))
      }
    },
    [onChange]
  )
  return (
    <Box
      width={size}
      height={size}
      boxShadow={2}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      bgcolor="white"
    >
      {content}
    </Box>
  )
}

export default ImageBin
