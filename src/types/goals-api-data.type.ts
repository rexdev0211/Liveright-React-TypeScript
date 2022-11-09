export type TargetDataType = {
  from?: string
  to?: string
  goal: number
  type: string
  value_type: string
}

export type GoalsApiDataType = {
  account_id?: number
  targets: TargetDataType[]
}
