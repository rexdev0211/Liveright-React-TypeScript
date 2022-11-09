import { PropsWithChildren } from 'react'

import { CrossIcon } from '../../../assets/media/icons'
import { DialogStyles } from './dialog.styles'

interface DialogProps {
  title?: string
  onClose?: () => void
  open: boolean
  className?: string
  closeIcon?: any
  extended?: boolean
}

export default function Dialog({
  title,
  open,
  onClose,
  children,
  className,
  closeIcon,
  extended
}: PropsWithChildren<DialogProps>) {
  return (
    <DialogStyles
      title={title}
      visible={open}
      footer={false}
      closeIcon={closeIcon === false ? () => null : <CrossIcon />}
      onCancel={onClose}
      width="100%"
      centered
      className={className}
      extended={extended}
    >
      {children}
    </DialogStyles>
  )
}
