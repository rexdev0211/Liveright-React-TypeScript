import { TimePicker as AntdTimePicker } from 'antd'
import moment, { Moment } from 'moment'

import { ClockIcon } from '../../../assets/media/icons'
import { getDisabledHours, getDisabledMinutes } from '../../../utils/date'
import FormError from '../../forms/form-error/form-error.component'
import Error from '../error/error.component'
import Label from '../label/label.component'
import Styles from './time-picker.styles'

interface TimePickerProps {
  id: string
  label?: string
  placeholder?: string
  value?: any
  className?: string
  disabled?: boolean
  disabledUntilNow?: boolean
  onChange?: (date: Moment | null, dateStr: string) => void
  name?: string
  error?: string
  format?: string
  minuteStep?: number
  showSuffixIcon?: boolean
  allowClear?: boolean
}

const FORMAT = 'H:mm'

export default function TimePicker({
  id,
  label,
  className,
  value,
  disabled,
  onChange,
  disabledUntilNow,
  name,
  error,
  format = FORMAT,
  minuteStep,
  showSuffixIcon = true,
  allowClear = true
}: TimePickerProps) {
  return (
    <Styles className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <AntdTimePicker
        suffixIcon={showSuffixIcon && <ClockIcon />}
        disabled={disabled}
        value={value ? moment(value, format) : null}
        onChange={onChange}
        format={format || FORMAT}
        minuteStep={minuteStep}
        disabledHours={() => {
          return getDisabledHours(disabledUntilNow || false)
        }}
        disabledMinutes={(hour) => {
          return getDisabledMinutes(disabledUntilNow || false, hour)
        }}
        getPopupContainer={(trigger: any) => trigger.parentElement}
        allowClear={allowClear}
      />
      {name && <FormError name={name} className="field-error" />}
      {error && <Error name={error} />}
    </Styles>
  )
}
