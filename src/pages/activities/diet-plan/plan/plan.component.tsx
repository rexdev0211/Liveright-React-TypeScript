import moment, { Moment } from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'

import Button from '../../../../components/buttons/button/button.component'
import Card from '../../../../components/cards/card/card.component'
import Dialog from '../../../../components/dialogs/dialog/dialog.component'
import Select from '../../../../components/form/select/select.component'
import StatusBadge from '../../../../components/status-badge/status-badge.component'
import { toast } from '../../../../components/toast/toast.component'
import { Subtitle, Title } from '../../../../components/typography'
import { Routes } from '../../../../enums/routes.enum'
import useClientAccount from '../../../../hooks/api/accounts/useClientAccount'
import useDietPlan from '../../../../hooks/api/activities/useDietPlan'
import { useIsMobile } from '../../../../hooks/is-mobile.hook'
import MobilePage from '../../../../layouts/mobile-page/mobile-page.component'
import { capitalize } from '../../../../pipes/capitalize.pipe'
import { getVersionOptions } from '../../../../utils/api/activities'
import { DATE_PRETTY_FORMAT, DATE_RENDER_FORMAT } from '../../../../utils/date'
import { getRoute } from '../../../../utils/routes'
import ActivitiesClient from '../../components/activities-client/activities-client.component'
import Alert from '../../components/alert/alert.component'
import DayDietPlanCard from '../../components/day-diet-plan-card/day-diet-plan-card.component'
import ConfirmDialog from '../../components/dialog/confirm-dialog/confirm-dialog.component'
import SplitDayMealCard from '../../components/split-day-meal-card/split-day-meal-card.component'
import { Styles } from '../../styles/plan.styles'
import AddDietPlan from '../add-plan/add-plan.component'
import DietPlanDayView from '../day-view/diet-plan-day-view.component'

export default function DietPlan() {
  const [edit, setEdit] = useState<boolean | number>(false)
  const [activationDate, setActivationDate] = useState<string>(
    new Date().toISOString()
  )
  const [expandedDayIndex, setExpandedDayIndex] = useState<boolean | number>(
    false
  )
  const [selectedFood, setSelectedFood] = useState<any>(null)
  const [confirmDialog, setConfirmDialog] = useState(false)
  const isMobile = useIsMobile()
  const params = useParams<any>()
  const history = useHistory()
  const queryParams = new URLSearchParams(location.search)
  const { user: client } = useClientAccount(params.clientId)

  useEffect(() => {
    if (queryParams.get('edit')) {
      setEdit(true)
    }
  }, [])

  useEffect(() => {
    if (!params.clientId) {
      history.push(`${Routes.ACTIVITIES}?return=${Routes.ACTIVITIES_DP}`)
    }
  }, [params.clientId])

  const { revision, dietPlan, onEdit } = useDietPlan({
    clientId: params.clientId,
    id: params.id,
    revisionId: params.revisionId
  })

  const onMakeActive = () => {
    onEdit(
      params.id,
      params.revisionId,
      {
        ...revision,
        scheduled_start_on: activationDate,
        scheduled_end_on: moment(activationDate).isBefore(
          revision.scheduled_end_on
        )
          ? revision.schedule_end_on
          : null
      },
      () => {
        toast.show({
          type: 'success',
          msg: `Diet Plan successfully ${
            activationDate === new Date().toISOString()
              ? 'made active'
              : 'scheduled'
          }.`
        })
        setConfirmDialog(false)
      }
    )
  }

  const startOn = revision.scheduled_start_on
    ? moment(new Date(revision.scheduled_start_on)).format(DATE_RENDER_FORMAT)
    : '-'

  const versionOptions = useMemo(
    () => getVersionOptions(dietPlan.revisions || []),
    [dietPlan]
  )

  const onFoodPlusClicked = (food: any) => {
    /**
     * The plus button is place on food item, so when clicked, we get
     * food item. But the UI to display it was decied to be the one
     * that shows a meal as a whole. So here he need to disguise out food item
     * as a meal, so that it can be used properly in the meal component.
     */

    console.log(food)

    setSelectedFood({
      name: food.data.name,
      items: [food],
      total_target: food.data?.info || {}
    })
  }

  if (edit || typeof edit === 'number') {
    return (
      <AddDietPlan
        editDay={typeof edit === 'number' ? edit : undefined}
        editId={params.id}
        revisionId={params.revisionId}
        onClose={() => setEdit(false)}
      />
    )
  }

  if (expandedDayIndex || typeof expandedDayIndex === 'number') {
    return (
      <DietPlanDayView
        onClose={() => setExpandedDayIndex(false)}
        index={expandedDayIndex as number}
        setIndex={setExpandedDayIndex}
        onEdit={() => {
          setEdit(expandedDayIndex)
          setExpandedDayIndex(false)
        }}
      />
    )
  }

  const content = (
    <>
      <Styles>
        <ActivitiesClient
          clientId={params.clientId}
          viewActivity={false}
          onClientSwitch={(id) => {
            history.push(
              getRoute(Routes.ACTIVITIES_DP, {
                clientId: id
              })
            )
          }}
        />
        <Card className="PlanPage__card">
          {!isMobile && (
            <div className="PlanPage__header">
              <Title>Current Diet Plan</Title>

              <div className="PlanPage__header-actions">
                <Button
                  variant="dark"
                  className="PlanPage__header-btn"
                  to={getRoute(Routes.ACTIVITIES_DP, {
                    clientId: params.clientId
                  })}
                >
                  See Other Plans
                </Button>
                <Button
                  className="PlanPage__header-btn"
                  onClick={() => setEdit(true)}
                >
                  Edit Diet Plan
                </Button>
              </div>
            </div>
          )}

          <div className="PlanPage__filters">
            <div className="PlanPage__filters-title-container">
              <Subtitle className="PlanPage__filters-title">
                {revision.name ?? dietPlan.name}
              </Subtitle>

              {isMobile && (
                <Button
                  variant="text"
                  size="sm"
                  className="PlanPage__filters-archived-btn"
                  to={getRoute(Routes.ACTIVITIES_DP, {
                    clientId: params.clientId
                  })}
                >
                  Archived Plans
                </Button>
              )}
            </div>

            <div className="PlanPage__filters-actions">
              <Select
                className="PlanPage__filters-select"
                id="DietPlan-version"
                options={versionOptions}
                value={versionOptions.find(
                  (o: any) => o.value === revision._id
                )}
                onChange={(e, o) => {
                  history.push(
                    getRoute(Routes.ACTIVITIES_DP_ID, {
                      clientId: params.clientId,
                      id: params.id,
                      revisionId: o.value
                    })
                  )
                }}
              />

              {!isMobile && revision.status === 'inactive' && (
                <Button
                  className="PlanPage__filters-make-active-btn"
                  onClick={() => setConfirmDialog(true)}
                >
                  Make active
                </Button>
              )}
            </div>
          </div>

          {revision.status === 'scheduled' && (
            <Alert
              content={`This Diet plan is set become active on ${startOn}.`}
            />
          )}

          {!isMobile && <div className="PlanPage__divider" />}

          <div className="PlanPage__badges">
            <div className="PlanPage__badges-content">
              <div className="PlanPage__badge">
                <p className="PlanPage__badge-title">Status</p>
                <StatusBadge
                  status={revision.status}
                  className="PlanPage__info-badge"
                >
                  {capitalize(revision.status)}
                </StatusBadge>
              </div>

              <div className="PlanPage__badge">
                <p className="PlanPage__badge-title">Start and end dates</p>
                <p className="PlanPage__badge-text">
                  {!revision.scheduled_start_on &&
                    !revision.scheduled_end_on &&
                    'No dates are selected for the Diet plan'}
                  {revision.scheduled_start_on || revision.scheduled_start_on
                    ? `${
                        revision.scheduled_start_on ||
                        (revision.scheduled_end_on &&
                          revision.scheduled_start_on)
                          ? moment(
                              new Date(revision.scheduled_start_on)
                            ).format(DATE_RENDER_FORMAT)
                          : '...'
                      } — 
                  ${
                    revision.scheduled_end_on
                      ? moment(new Date(revision.scheduled_end_on)).format(
                          DATE_RENDER_FORMAT
                        )
                      : '...'
                  }`
                    : ''}
                </p>
              </div>

              {/* {revision.status === 'active' && (
                <div className="PlanPage__badge">
                  <p className="PlanPage__badge-title">Start and end dates</p>
                  <p className="PlanPage__badge-text">
                    The start and end dates of this training plan are tied to
                    the active Training Split
                  </p>
                </div>
              )}
              {revision.status === 'scheduled' && (
                <div className="PlanPage__badge">
                  <p className="PlanPage__badge-title">Starting on</p>
                  <p className="PlanPage__badge-text">
                    {revision.scheduled_start_on
                      ? moment(new Date(revision.scheduled_start_on)).format(
                          DATE_RENDER_FORMAT
                        )
                      : '-'}
                  </p>
                </div>
              )} */}
            </div>
          </div>

          {!isMobile && (
            <div className="PlanPage__cards">
              {revision.days?.map((row: any, index: number) => (
                <DayDietPlanCard
                  key={row._id}
                  onExpand={() => setExpandedDayIndex(index)}
                  onFoodClick={onFoodPlusClicked}
                  day={row}
                />
              ))}
            </div>
          )}
        </Card>

        {isMobile && (
          <>
            <p className="PlanPage__subtitle">List of meal days</p>

            {revision.days?.map((row: any, index: number) => (
              <DayDietPlanCard
                onExpand={() => setExpandedDayIndex(index)}
                onFoodClick={onFoodPlusClicked}
                day={row}
                key={row._id}
              />
            ))}
          </>
        )}

        <Dialog
          open={!!selectedFood}
          onClose={() => setSelectedFood(null)}
          title="Food Detail"
          extended
        >
          <SplitDayMealCard data={selectedFood} />
        </Dialog>

        {isMobile && (
          <Button onClick={() => setConfirmDialog(true)}>Make active</Button>
        )}
      </Styles>

      <ConfirmDialog
        name="Make Active Diet Plan"
        description="You're about to make the following diet plan the active one"
        title={dietPlan.name}
        alert={`This will make “${dietPlan.name}” ${client.full_name}’s ${
          moment(activationDate).isAfter() ? 'scheduled' : 'active'
        } diet plan starting from ${moment(activationDate).format(
          DATE_PRETTY_FORMAT
        )}. This means the training split will also be changed to reference this diet plan.
         You can revert it at any point by re-activating previous diet plan as the active diet plan.`}
        date={{
          label: 'From when should we apply this change?',
          value: activationDate,
          disabledDate: (date: Moment) => date.isBefore(),
          onChange: (date: any) =>
            setActivationDate(new Date(date).toISOString())
        }}
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        actions={{
          yes: 'Confirm Changes',
          cancel: 'Nevermind',
          onYes: onMakeActive,
          onCancel: () => {
            setConfirmDialog(false)
            setActivationDate(new Date().toISOString())
          },
          layout: 'left'
        }}
      />
    </>
  )

  return isMobile ? (
    <MobilePage
      title="Current Diet Plan"
      headerSpacing={20}
      headerNavChat
      actionComponent={<Button onClick={() => setEdit(true)}>Edit Plan</Button>}
    >
      {content}
    </MobilePage>
  ) : (
    content
  )
}
