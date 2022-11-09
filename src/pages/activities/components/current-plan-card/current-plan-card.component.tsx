import { useState } from 'react'

import { CheckIcon } from '../../../../assets/media/icons/activities'
import Button from '../../../../components/buttons/button/button.component'
import { DATA } from '../../current-plan/current-active-split.component'
import { Styles } from './current-plan-card.styles'

interface CurrentPlanCardProps {
  data: any
  scheduleTime: string
  type: any
}

export default function CurrentPlanCard({
  data,
  scheduleTime,
  type
}: CurrentPlanCardProps) {
  const [open, setOpen] = useState(false)

  const getData = (key: keyof typeof DATA) => {
    return DATA[key]
  }

  return (
    <Styles $color={getData(type).color}>
      <div className="CurrentPlanCard__summary">
        <div className="CurrentPlanCard__summary-content">
          <div className="CurrentPlanCard__summary-icon">
            {getData(type).icon}
          </div>

          <p className="CurrentPlanCard__summary-time">{scheduleTime}</p>

          <div>
            <p className="CurrentPlanCard__summary-title">{data?.name}</p>

            <div className="CurrentPlanCard__summary-btn-container">
              <button
                className="CurrentPlanCard__summary-btn"
                onClick={() => setOpen(!open)}
              >
                {String(
                  (type === 'workout'
                    ? data?.items?.length
                    : type === 'meal'
                    ? data?.total_target?.calories
                    : '') ?? ''
                ) +
                  ' ' +
                  getData(type).action}
              </button>
            </div>
          </div>
        </div>

        <Button variant="secondary" size="sm">
          Log This
        </Button>
      </div>

      {open && (
        <div className="CurrentPlanCard__content">
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
