import { FoodIcon } from '../../../../assets/media/icons/activities'
import DayCard from '../day-card/day-card.component'
import DayCardListItem from '../day-card-list-item/day-card-list-item.component'
import { Styles } from './day-diet-plan-card.styles'

interface DayDietPlanCardProps {
  day: any
  onExpand?: () => void
  onFoodClick: (food: any) => void
  border?: 'both' | 'mobile' | 'desktop'
}

export default function DayDietPlanCard({
  day,
  onExpand,
  onFoodClick,
  border = 'desktop'
}: DayDietPlanCardProps) {
  return (
    <DayCard
      title={day?.name}
      onExpand={onExpand}
      border={border}
      content={
        <Styles>
          {day?.activities?.map((row: any) => (
            <div className="DayDietPlanCard__content" key={row._id}>
              <div className="DayDietPlanCard__name-container">
                <div className="DayDietPlanCard__name-icon">
                  <FoodIcon />
                </div>

                <p className="DayDietPlanCard__name">{row.name}</p>
              </div>

              <div className="day-tp-card__content">
                <div>
                  {row.items?.map((row: any) => (
                    <DayCardListItem
                      key={row._id}
                      title={row.data?.name || '-'}
                      onClick={() => onFoodClick(row)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </Styles>
      }
    />
  )
}
