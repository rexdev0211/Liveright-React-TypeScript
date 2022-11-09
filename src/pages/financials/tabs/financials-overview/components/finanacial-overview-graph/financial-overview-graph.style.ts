import styled from 'styled-components'

import Card from '../../../../../../components/cards/card/card.component'
import { mediaQueries } from '../../../../../../enums/screen-sizes.enum'
import { getColorCarry } from '../../../../../../pipes/theme-color.pipe'

export default styled(Card)`
  .f-overview {
    &__view-btn {
      width: 100%;
    }

    &__cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 1.25rem;
    }

    &__range {
      width: 144px;

      @media ${mediaQueries.TABLET} {
        max-width: 100%;
      }
    }

    &__chart-range {
      margin-bottom: 1.875rem;
    }
    &__graph {
      margin: 1rem 0;
      width: 100%;

      @media ${mediaQueries.TABLET} {
        margin: 1.25rem 0;
      }

      &__title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;

        &-wrapper {
          display: flex;
          align-items: center;

          @media ${mediaQueries.TABLET} {
            flex-direction: column;
            align-items: start;
          }

          .f-overview__graph__checkbox {
              display: flex;
              align-items: center;
              margin-left: 76px;
              @media ${mediaQueries.TABLET} {
                margin-left: 0;
                margin-top: 8px;
              }
              &-label {
              font-family: Circular Std;
              font-size: 14px;
              line-height: 20px;
              color: #2e2f31;
              white-space: nowrap;
              
              label {
                margin-right: 14px;
              }
              }
            }
          }
        }
        h2 {
          font-size: 1.125rem;
          font-weight: 700;
          color: ${getColorCarry('primaryDark_v2')};
        }
      }

      &__body {
        background-color: white;
        border-radius: ${(p) => p.theme.vars.sizes.borderRadius};
        padding: 24px;
        margin-top: 24px;
        max-height: 350px;
      }
    }

    &__chart-container {
      padding-top: 2rem;
    }
  }
`
