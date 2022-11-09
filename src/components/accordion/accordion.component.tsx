import React, { createContext, HTMLProps, useRef, useState } from 'react'

import { ReactComponent as DownArrowIcon } from '../../assets/media/icons/down-arrow.svg'
import { classes } from '../../pipes/classes.pipe'
import Card from '../card/card.style'
import Styles from './accordion.styles'

export type ItemPropsType = {
  children: React.ReactNode
  title: string
  open?: boolean
  switchOpen?: () => void
}
type AccordionContextType = {
  closeAll: () => void
}
export const AccordionContext = createContext<AccordionContextType>({
  closeAll: () => {}
})
const Item = ({ children, title, open, switchOpen }: ItemPropsType) => {
  const content = useRef<HTMLDivElement>(null)
  return (
    <article className={'accordion__item'}>
      <Card className={'accordion__item__card'}>
        <div className={'accordion__header'} onClick={switchOpen}>
          <h3 className={'accordion__title'}>{title}</h3>
          <DownArrowIcon
            className={classes(
              'accordion__icon',
              open && 'accordion__icon__open'
            )}
          />
        </div>
        <div
          className={'accordion__body'}
          style={{
            height: `${open ? content?.current?.scrollHeight || '' : 0}px`
          }}
          ref={content}
        >
          <div>{children}</div>
        </div>
      </Card>
    </article>
  )
}
type AccordionPropsType = HTMLProps<HTMLDivElement> & {
  children: React.ReactNode
}
const Accordion = ({ children, ...props }: AccordionPropsType) => {
  const [open, setOpen] = useState(-1)
  return (
    <AccordionContext.Provider value={{ closeAll: () => setOpen(-1) }}>
      <Styles
        onClick={props.onClick}
        style={props.style}
        className={classes(props.className, 'accordion')}
      >
        {React.Children.map(children, (child, i) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...child.props,
              open: i === open,
              switchOpen: () => setOpen(i === open ? -1 : i)
            })
          }
          return child
        })}
      </Styles>
    </AccordionContext.Provider>
  )
}
Accordion.Item = Item
export default Accordion
