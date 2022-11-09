import React from 'react'

import { CustomSelect } from '../../../../components/form/select/select.component'

interface InputSearchProps {
  id: string
  label?: string
  placeholder?: string
  options: any[]
  value: string
  onSearch: any
  forceDesktop?: boolean
  onChange: (value: any, option: any) => void
  error?: string
}
export const InputSearch = (props: InputSearchProps) => {
  const { options, ...other } = props

  return (
    <CustomSelect
      {...other}
      search
      options={options}
      className="WorkoutAccordion__control"
    />
  )
}
