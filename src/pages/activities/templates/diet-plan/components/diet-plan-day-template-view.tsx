import moment from 'moment'
import { useMemo, useState } from 'react'

import { CaretLeftIcon } from '../../../../../assets/media/icons'
import Button from '../../../../../components/buttons/button/button.component'
import GoBack from '../../../../../components/buttons/go-back/go-back.component'
import IconButton from '../../../../../components/buttons/icon-button/icon-button.component'
import Card from '../../../../../components/cards/card/card.component'
import { FormToggleUI } from '../../../../../components/forms/form-toggle/form-toggle.component'
import { Subtitle, Title } from '../../../../../components/typography'
import { useIsMobile } from '../../../../../hooks/is-mobile.hook'
import HeaderLink from '../../../../../layouts/mobile-page/components/header-link/header-link.component'
import MobilePage from '../../../../../layouts/mobile-page/mobile-page.component'
import SplitDayDietCard from '../../../components/split-day-card/split-day-diet-card.component'
import { Styles } from './diet-plan-day-template-view.styles'

interface DietPlanDayViewProps {
  onClose: any
  index: number
  data: any
  setIndex: (i: number) => void
  onEdit: () => void
}

export default function DietPlanDayView({
  onClose,
  index,
  setIndex,
  onEdit,
  data
}: DietPlanDayViewProps) {
  const isMobile = useIsMobile()
  const [scheduleView, setScheduleView] = useState(false)

  const { day, activites: activities } = useMemo(() => {
    const day = data?.days?.[index]
    const activites: any[] =
      day?.activities?.map((a: any) => ({
        day: {
          activities: [a],
          name: a.name,
          total_target: a.total_target
        },
        time: a.time,
        type: 'meal'
      })) || []

    activites.sort(
      (a, b) =>
        Date.parse('1970/01/01 ' + a.time || '00:00') -
        Date.parse('1970/01/01 ' + b.time || '00:00')
    )

    return {
      day,
      activites
    }
  }, [index, data])

  const content = (
    <Styles>
      <Card className="TrainingSplitDayView__card">
        {!isMobile && (
          <>
            <GoBack spacing={4} onClick={onClose}>
              Go Back to Diet Plan Overview
            </GoBack>

            <div className="TrainingSplitDayView__title-container">
              <Title>Current Diet Plan</Title>

              <Button onClick={onEdit}>Edit Diet Plan</Button>
            </div>

            <div className="TrainingSplitDayView__divider" />
          </>
        )}
        <Subtitle>{data.name}</Subtitle>
      </Card>

      <Card>
        <div>
          <Title className="TrainingSplitDayView__day-title">
            <span>{`Day ${index + 1}`}</span>

            <div className="TrainingSplitDayView__day-arrows">
              <IconButton
                size="sm"
                onClick={() =>
                  setIndex((index - 1 + data.days_count) % data.days_count)
                }
              >
                <CaretLeftIcon />
              </IconButton>
              <IconButton
                size="sm"
                onClick={() => setIndex((index + 1) % data.days_count)}
              >
                <CaretLeftIcon />
              </IconButton>
            </div>
          </Title>
        </div>

        <div className="TrainingSplitDayView__day-subtitle-container">
          <p className="TrainingSplitDayView__day-subtitle">
            {moment(data.scheduled_start_on).add(index, 'day').format('dddd')}
          </p>

          <div className="TrainingSplitDayView__day-toggle">
            <FormToggleUI
              value={scheduleView}
              onUpdate={() => setScheduleView(!scheduleView)}
            />
            <p className="TrainingSplitDayView__day-toggle-label">
              See with schedule view
            </p>
          </div>
        </div>

        <div className="TrainingSplitDayView__divider" />

        <div className="TrainingSplitDayView__cards">
          {!scheduleView ? (
            <SplitDayDietCard data={day} />
          ) : (
            activities.map((a: any, i: number) => (
              <SplitDayDietCard
                key={i}
                data={a.day}
                scheduleTime={a.time || 'Not Set'}
              />
            ))
          )}
        </div>
      </Card>
    </Styles>
  )

  return isMobile ? (
    <MobilePage
      title="Current Training Split"
      headerTopComponent={
        <HeaderLink onClick={onClose}>Back to diet split overview</HeaderLink>
      }
    >
      {content}
    </MobilePage>
  ) : (
    content
  )
}
