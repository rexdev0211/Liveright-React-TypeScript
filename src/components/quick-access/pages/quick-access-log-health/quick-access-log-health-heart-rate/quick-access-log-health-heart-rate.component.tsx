import { Form, Formik, FormikHelpers, FormikProps } from 'formik'
import React, { FC } from 'react'
import * as Yup from 'yup'

import { useTranslation } from '../../../../../modules/i18n/i18n.hook'
import { HealthData } from '../../../../../pages/progress/progress.types'
import { getHeartRateQuality } from '../../../../../pages/progress-log/log-health-data/log-health-data.helpers'
import { serverError } from '../../../../../pipes/server-error.pipe'
import { toast } from '../../../../toast/toast.component'
import QuickAccessBack from '../../../components/quick-access-back/quick-access-back.component'
import { QuickAccessButton } from '../../../components/quick-access-button.styles'
import QuickAccessLogRow from '../../../components/quick-access-log-row/quick-access-log-row.component'
import QuickAccessTitle from '../../../components/quick-access-title/quick-access-title.component'
import { useQuickAccess } from '../../../quick-access.context'
import { quickAccessRoutes } from '../../../quick-access.routes'
import { QuickAccessLogDataType } from '../../../types/quick-access-log-data.type'
import Styles from './quick-access-log-health-heart-rate.styles'

type Props = {}
const QuickAccessLogHealthHeartRate: FC<Props> = ({}) => {
  const { t } = useTranslation()
  const { setOpen, logHealthData, todayHealthData } = useQuickAccess()
  const onSubmit = (
    values: QuickAccessLogDataType,
    helper: FormikHelpers<QuickAccessLogDataType>
  ) => {
    console.log('submitting', values)
    const payload: HealthData = {
      heart_rate: {
        avg_rate: +values.data,
        quality: getHeartRateQuality(+values.data)
      }
    }
    logHealthData(payload)
      .then(() => {
        helper.setSubmitting(false)
        setOpen(false)
        toast.show({
          type: 'success',
          msg: 'Heart rate data logged successfully'
        })
      })
      .catch((e) => toast.show({ type: 'error', msg: serverError(e) }))
  }
  return (
    <Styles>
      <QuickAccessBack
        label={'health-data'}
        route={quickAccessRoutes.LOG_HEALTH_DATA}
      />
      <QuickAccessTitle label={'Today'}>
        {t('quickaccess:menu.heart-rate')}
      </QuickAccessTitle>
      <Formik
        initialValues={{
          data: String(todayHealthData?.heart_rate?.avg_rate || '')
        }}
        onSubmit={onSubmit}
        validationSchema={Yup.object({
          data: Yup.number().required().min(25).max(200)
        })}
      >
        {({ isValid }: FormikProps<QuickAccessLogDataType>) => (
          <Form>
            <QuickAccessLogRow
              min={0}
              max={200}
              label={t('progress:heart_rate_short')}
              getQuality={getHeartRateQuality}
            />
            <QuickAccessButton
              htmlType={'submit'}
              type={'primary'}
              disabled={!isValid}
            >
              {t('submit')}
            </QuickAccessButton>
          </Form>
        )}
      </Formik>
    </Styles>
  )
}

export default QuickAccessLogHealthHeartRate
