import moment from 'moment'
import { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'

import { FoodIcon } from '../../../../assets/media/icons/activities'
import Button from '../../../../components/buttons/button/button.component'
import Card from '../../../../components/cards/card/card.component'
import DataPagination from '../../../../components/data-pagination/data-pagination.component'
import DataTable from '../../../../components/data-table/data-table.component'
import ClientSelect from '../../../../components/form/client-select/client-select.component'
import Select from '../../../../components/form/select/select.component'
import {
  EmptyPlaceholder,
  LoadingPlaceholder
} from '../../../../components/placeholders'
import StatusBadge from '../../../../components/status-badge/status-badge.component'
import Tooltip from '../../../../components/tooltip/tooltip.component'
import { Title } from '../../../../components/typography'
import { Routes } from '../../../../enums/routes.enum'
import userTypes from '../../../../enums/user-types.enum'
import useDietPlans from '../../../../hooks/api/activities/useDietPlans'
import { useAuth } from '../../../../hooks/auth.hook'
import { useIsMobile } from '../../../../hooks/is-mobile.hook'
import MobilePage from '../../../../layouts/mobile-page/mobile-page.component'
import { capitalize } from '../../../../pipes/capitalize.pipe'
import {
  getActiveOrLatestRev,
  getStatus
} from '../../../../utils/api/activities'
import { DATE_RENDER_FORMAT } from '../../../../utils/date'
import { getRoute } from '../../../../utils/routes'
import ActivitiesClient from '../../components/activities-client/activities-client.component'
import EmptyPlan from '../../components/empty-plan/empty-plan.component'
import PlanCard from '../../components/plan-card/plan-card.component'
import { Styles } from '../../styles/plans-table.styles'
import AddDietPlan from '../add-plan/add-plan.component'

const LABELS = ['Diet Plan Name', 'Client', 'Days', 'Start', 'End', 'Status']
const KEYS = ['name', 'client', 'days', 'start', 'end', 'status']

export default function DietPlans() {
  const isMobile = useIsMobile()
  const { clientId } = useParams<{ clientId: any }>()
  const history = useHistory()
  const { type: userType } = useAuth()
  const [add, setAdd] = useState(false)
  const [status, setStatus] = useState('')
  const [sorting, setSorting] = useState<any>({
    sortKey: '',
    sortMethod: 0
  })
  const { isLoading, dietPlans, meta, onPage } = useDietPlans({
    clientId,
    status
  })

  const queryParams = new URLSearchParams(location.search)

  useEffect(() => {
    if (queryParams.get('create') && clientId) {
      setAdd(true)
    }
  }, [])

  // useEffect(() => {
  //   if (!clientId) {
  //     history.push(`${Routes.ACTIVITIES}?return=${Routes.ACTIVITIES_DP}`)
  //   }
  // }, [clientId])

  if (add) {
    return <AddDietPlan onClose={() => setAdd(false)} />
  }

  const sortLogic = (a: any, b: any) => {
    let sortValue = 0
    switch (sorting?.sortKey) {
      case 'name':
        sortValue =
          a?.name?.toLowerCase().localeCompare(b?.name?.toLowerCase()) *
          sorting?.sortMethod
        break
      case 'client':
        sortValue =
          a?.account?.user?.full_name
            ?.toLowerCase()
            .localeCompare(b?.account?.user?.full_name?.toLowerCase()) *
          sorting?.sortMethod
        break
      case 'days':
        sortValue =
          getActiveOrLatestRev(a)
            ?.days_count?.toString()
            ?.localeCompare(getActiveOrLatestRev(b)?.days_count?.toString()) *
          sorting?.sortMethod
        break
      case 'start':
        sortValue =
          (getActiveOrLatestRev(a)?.scheduled_start_on
            ? getActiveOrLatestRev(a)?.scheduled_start_on
            : ''
          ).localeCompare(
            getActiveOrLatestRev(b)?.scheduled_start_on
              ? getActiveOrLatestRev(b)?.scheduled_start_on
              : ''
          ) * sorting?.sortMethod
        break
      case 'end':
        sortValue =
          (getActiveOrLatestRev(a)?.scheduled_end_on
            ? getActiveOrLatestRev(a)?.scheduled_end_on
            : ''
          ).localeCompare(
            getActiveOrLatestRev(b)?.scheduled_end_on
              ? getActiveOrLatestRev(b)?.scheduled_end_on
              : ''
          ) * sorting?.sortMethod
        break
      case 'status':
        sortValue =
          a?.status?.toLowerCase().localeCompare(b?.status?.toLowerCase()) *
          sorting?.sortMethod
        break
      default:
        break
    }
    return sortValue
  }

  const content =
    userType === userTypes.CLIENT && !dietPlans.length ? (
      <Styles>
        <EmptyPlan
          title="Diet Plans"
          text="There is no diet plan yet..."
          Icon={FoodIcon}
          action={
            <Button onClick={() => setAdd(true)}>Create Diet Plan</Button>
          }
        />
      </Styles>
    ) : (
      <Styles>
        {userType !== userTypes.CLIENT && (
          <ActivitiesClient
            clientId={clientId}
            viewActivity={false}
            onClientSwitch={(id) => {
              history.push(getRoute(Routes.ACTIVITIES_DP, { clientId: id }))
            }}
          />
        )}

        <Card className="PlansTable__card">
          {!isMobile && (
            <>
              <div className="PlansTable__title-container">
                <Title>Diet Plans</Title>

                <div>
                  {clientId !== 'all' && (
                    <Button onClick={() => setAdd(true)}>
                      Create New Plan
                    </Button>
                  )}
                  {clientId === 'all' && (
                    <Tooltip title="Please select a client before creating a plan">
                      <Button>Create New Plan</Button>
                    </Tooltip>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="PlansTable__filters">
            {userType !== userTypes.CLIENT && (
              <ClientSelect
                id="DietPlans-client"
                onChange={(e) => {
                  history.push(getRoute(Routes.ACTIVITIES_DP, { clientId: e }))
                }}
                value={clientId}
                placeholder="All Client"
                className="PlansTable__select"
              />
            )}

            <Select
              id="DietPlans-statuses"
              options={[
                { label: 'Any Status', value: '' },
                { label: 'Active', value: 'active' },
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'Inactive', value: 'inactive' }
              ]}
              value={status}
              onChange={(value) => setStatus(value)}
              placeholder="Any Status"
              className="PlansTable__select"
            />
          </div>

          <div>
            {isMobile ? (
              <>
                {dietPlans.map((row, index) => (
                  <PlanCard
                    plan={row}
                    key={index}
                    to={getRoute(Routes.ACTIVITIES_DP_ID, {
                      clientId: row.account_id || clientId,
                      id: row._id,
                      revisionId: getActiveOrLatestRev(row)?._id
                    })}
                  />
                ))}
              </>
            ) : (
              <DataTable
                labels={LABELS}
                data={dietPlans.sort(sortLogic)}
                keys={KEYS}
                sort={sorting}
                setSort={setSorting}
                round="10px"
                render={{
                  name: (row) => (
                    <Link
                      className="PlansTable__table-link"
                      to={getRoute(Routes.ACTIVITIES_DP_ID, {
                        clientId: row.account_id || clientId,
                        id: row._id,
                        revisionId: getActiveOrLatestRev(row)?._id
                      })}
                    >
                      <span>{row.name}</span>
                    </Link>
                  ),
                  client: (row) => (
                    <span>
                      {row.account
                        ? [
                            row.account?.user?.first_name,
                            row.account?.user?.last_name
                          ]
                            .filter(Boolean)
                            .join(' ') || '-'
                        : '-'}
                    </span>
                  ),
                  days: (row) => (
                    <span>{getActiveOrLatestRev(row)?.days_count}</span>
                  ),
                  start: (row) => (
                    <span>
                      {getActiveOrLatestRev(row)?.scheduled_start_on
                        ? moment(
                            new Date(
                              getActiveOrLatestRev(row)?.scheduled_start_on
                            )
                          ).format(DATE_RENDER_FORMAT)
                        : '-'}
                    </span>
                  ),
                  end: (row) => (
                    <span>
                      {getActiveOrLatestRev(row)?.scheduled_end_on
                        ? moment(
                            new Date(
                              getActiveOrLatestRev(row)?.scheduled_end_on
                            )
                          ).format(DATE_RENDER_FORMAT)
                        : '-'}
                    </span>
                  ),
                  status: (row) => (
                    <StatusBadge
                      status={getStatus(row)?.toLowerCase()}
                      className="PlansTable__table-status"
                    >
                      {capitalize(getStatus(row))}
                    </StatusBadge>
                  )
                }}
              />
            )}

            {isLoading && <LoadingPlaceholder spacing />}
            {!dietPlans.length && !isLoading && <EmptyPlaceholder spacing />}
          </div>
          <div>
            <DataPagination
              page={meta.current_page}
              total={meta.total}
              setPage={onPage}
            />
          </div>
        </Card>
      </Styles>
    )

  return isMobile ? (
    <MobilePage
      title="Diet Plans"
      headerSpacing={20}
      headerNavChat
      actionComponent={
        clientId === 'all' ? (
          <Tooltip title="Please select a client before creating a plan">
            <Button>Create Plan</Button>
          </Tooltip>
        ) : (
          <Button onClick={() => setAdd(true)}>Create Plan</Button>
        )
      }
    >
      {content}
    </MobilePage>
  ) : (
    content
  )
}
