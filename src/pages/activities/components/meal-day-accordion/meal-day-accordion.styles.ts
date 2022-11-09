import styled, { css } from 'styled-components'

import { getColorCarry } from '../../../../pipes/theme-color.pipe'

export const Styles = styled.div<any>`
  .MealDayAccordion {
    &__macronutrients {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      margin: 0 -0.25rem;
      margin-bottom: 2rem;

      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */

      /* Hide scrollbar for Chrome, Safari and Opera */
      &::-webkit-scrollbar {
        display: none;
      }
    }

    &__name {
      &-container {
        display: flex;
        margin-bottom: 0.5rem;
      }
    }

    &__subtitle {
      font-size: 0.875rem;
      color: ${getColorCarry('neutral_70')};
      margin-bottom: 1rem;
      font-weight: 500;
    }

    &__checkbox {
      margin: 0 0.75rem;

      &-container {
        display: flex;
        align-items: center;
        margin: 1.5rem 0;
        margin-top: 0.5rem;
      }
    }
    &__day-toggle {
      display: flex;
      width: 160px;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }
  }

  ${(props) =>
    props.$isDragging &&
    css`
      border: 1px dashed ${getColorCarry('orange_60')};
      padding: 1rem 1rem 0 1rem;
    `};
`
