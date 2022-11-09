import { TargetDataType } from '../../types/goals-api-data.type'

const getTotalProjectedIncome = (
  monthlyIncomes: any,
  progressCount: any,
  sessionCount: any
) => {
  const ptI =
    (monthlyIncomes.pt_sessions / progressCount.pt_sessions) * sessionCount.pt
  const coachingI =
    (monthlyIncomes.coaching_sessions / progressCount.coaching_sessions) *
    sessionCount.coaching
  const consultationI =
    (monthlyIncomes.consultations_sessions /
      progressCount.consultations_sessions) *
    sessionCount.consultation

  return ptI + coachingI + consultationI
}

export const getOverviewTableData = (
  monthlyTarget: number,
  monthlyIncomes: any,
  progressCount: any,
  sessionCount: any,
  getGoalsTargetByType: (
    type: string,
    goalsData?: TargetDataType[] | null | undefined
  ) => number | undefined
) => {
  return [
    {
      revenue: 'PT Sessions',
      type: 'pt_session',
      salesCompleted: progressCount.pt_sessions,
      avgRate: monthlyIncomes.pt_sessions / progressCount.pt_sessions,
      bookings: sessionCount.pt,
      projectedIncome:
        (monthlyIncomes.pt_sessions / progressCount.pt_sessions) *
        sessionCount.pt,
      targetIncome: getGoalsTargetByType('pt_session') || 0
    },
    {
      revenue: 'Coaching',
      type: 'coaching',
      salesCompleted: progressCount.coaching_sessions,
      avgRate:
        monthlyIncomes.coaching_sessions / progressCount.coaching_sessions,
      bookings: sessionCount.coaching,
      projectedIncome:
        (monthlyIncomes.coaching_sessions / progressCount.coaching_sessions) *
        sessionCount.coaching,
      targetIncome: getGoalsTargetByType('coaching') || 0
    },
    {
      revenue: 'Consultations',
      type: 'consultation',
      salesCompleted: progressCount.consultations_sessions,
      avgRate:
        monthlyIncomes.consultations_sessions /
        progressCount.consultations_sessions,
      bookings: sessionCount.consultation,
      projectedIncome:
        (monthlyIncomes.consultations_sessions /
          progressCount.consultations_sessions) *
        sessionCount.consultation,
      targetIncome: getGoalsTargetByType('consultation') || 0
    },
    // {
    //   revenue: 'Supplements Sales',
    //   type: '',
    //   salesCompleted: 0,
    //   avgRate: 0,
    //   bookings: 0,
    //   projectedIncome: 0,
    //   targetIncome: 0
    // },
    // {
    //   revenue: 'Meal Plan Sales',
    //   type: '',
    //   salesCompleted: 0,
    //   avgRate: 0,
    //   bookings: 0,
    //   projectedIncome: 0,
    //   targetIncome: 0
    // },
    {
      revenue: 'Total',
      type: 'total_monthly_revenue',
      salesCompleted: 0,
      avgRate: 0,
      bookings: 0,
      projectedIncome: getTotalProjectedIncome(
        monthlyIncomes,
        progressCount,
        sessionCount
      ),
      targetIncome: monthlyTarget
    }
  ]
}
