import styled from 'styled-components'

import Card from '../../../../components/cards/card/card.component'
import { mediaQueries } from '../../../../enums/screen-sizes.enum'
import { getColor, getColorCarry } from '../../../../pipes/theme-color.pipe'

export const Styles = styled(Card)<any>`
  padding: 0;
  margin-bottom: 1.25rem;

  &:last-child {
    margin-bottom: 1.25rem;
  }

  .DayAccordion {
    &__summary {
      padding: 1.5rem 1.875rem;
      display: flex;
      align-items: center;
      justify-content: space-between;

      @media ${mediaQueries.TABLET} {
        padding: 1rem;
      }

      &-icon {
        width: 34px;
        height: 34px;
        min-width: 34px;
        min-height: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 9999px;
        background-color: ${(props: any) => props.$iconColor};
        margin-right: 1rem;
        color: #fff;

        & svg {
          width: 20px;
          height: 20px;
        }
      }

      &-title {
        font-size: 1.175rem;
        font-weight: 700;
        color: ${(props: any) =>
          props.$error
            ? getColor(props, 'red')
            : getColor(props, 'primaryDark_v2')};

        @media ${mediaQueries.TABLET} {
          font-size: 0.875rem;
        }

        &-container {
          display: flex;
          align-items: center;
        }
      }

      &-btn {
        width: 44px;
        display: flex;
        justify-content: center;
        align-items: center;

        & svg {
          transform: ${(props) => (props.$open ? 'rotate(180deg)' : 'none')};
        }
      }
    }

    &__actions {
      display: flex;
      align-items: center;
    }

    &__delete-btn {
      width: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: ${getColorCarry('red')};
      margin-right: 0.5rem;
    }

    &__content {
      padding: 0 1.875rem 1.5rem 1.875rem;

      @media ${mediaQueries.TABLET} {
        padding: 1rem;
      }
    }
  }
`
