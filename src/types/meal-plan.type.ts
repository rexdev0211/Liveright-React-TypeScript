import { FoodInfoType } from './food.type'
import { LibraryType } from './library.type'

export type MealPlanItemType = {
  meal_id: number
  timestamp: number
}
export type MealPlanType = LibraryType & {
  total_target: FoodInfoType
  current: FoodInfoType
  eat_list: MealPlanItemType[]
}
