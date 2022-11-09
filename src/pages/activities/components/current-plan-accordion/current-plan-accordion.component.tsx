import { useState } from 'react'

import { CheckIcon } from '../../../../assets/media/icons/activities'
import Button from '../../../../components/buttons/button/button.component'
import { DATA } from '../../current-plan/current-active-split.component'
import { Styles } from './current-plan-accordion.styles'

interface CurrentPlanAccordionProps {
  data: any
  scheduleTime: string
  type: any
}

export default function CurrentPlanAccordion({
  data,
  scheduleTime,
  type
}: CurrentPlanAccordionProps) {
  const [open, setOpen] = useState(false)

  const getData = (key: keyof typeof DATA) => {
    return DATA[key]
  }

  return (
    <Styles $color={getData(type).color}>
      <div
        className="CurrentPlanAccordion__summary"
        onClick={() => setOpen((open) => !open)}
      >
        <div className="CurrentPlanAccordion__header">
          <div className="CurrentPlanAccordion__icon">{getData(type).icon}</div>

          <div>
            <p className="CurrentPlanAccordion__title">{data?.name}</p>
            <p className="CurrentPlanAccordion__action">
              {String(
                (type === 'workout'
                  ? data?.items?.length
                  : type === 'meal'
                  ? data?.total_target?.calories
                  : '') ?? ''
              ) +
                ' ' +
                getData(type).action}
            </p>
          </div>
        </div>

        <div className="CurrentPlanAccordion__cta">
          <span className="CurrentPlanAccordion__time">{scheduleTime}</span>

          <Button variant="secondary" size="sm">
            Log This
          </Button>
        </div>
      </div>

      {open && (
        <div className="CurrentPlanAccordion__content">
          {data?.items?.map((row: any, index: number) => (
            <p key={index} className="CurrentPlanCard__content-item">
              <span>{row.data.name}</span>

              <CheckIcon />
            </p>
          ))}
        </div>
      )}
    </Styles>
  )
}
