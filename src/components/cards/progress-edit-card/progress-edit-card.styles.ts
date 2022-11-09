import styled, { css } from 'styled-components'

import { mediaQueries } from '../../../enums/screen-sizes.enum'
import { getColorCarry } from '../../../pipes/theme-color.pipe'
import Card from '../../cards/card/card.component'
import Input from '../../form/input/input.component'

export const Styles = styled(Card)<any>`
  padding: 1.25rem 1.875rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.875rem;
  color: ${getColorCarry('primaryDark_v2')};
  margin-bottom: 1.875rem;

  @media ${mediaQueries.TABLET} {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  &:last-child {
    margin-bottom: 0;
  }

  .progress-edit-card {
    &__cell {
      display: flex;
      align-items: center;

      &:first-child {
        border-right: 1px solid ${getColorCarry('inputBorder_v2')};
        padding-right: 1.875rem;
      }

      &:last-child {
        border-left: 1px solid ${getColorCarry('inputBorder_v2')};
        padding-left: 1.875rem;
      }

      @media ${mediaQueries.TABLET} {
        &:first-child {
          border-right: 0;
          padding-right: 0;
          padding-bottom: 1rem;
          border-bottom: 1px solid ${getColorCarry('inputBorder_v2')};
        }

        &:last-child {
          border-left: 0;
          padding-left: 0;
        }
      }
    }

    &__icon {
      margin-right: 1.5rem;
      width: 40px;
      height: 40px;

      & svg {
        width: 40px;
        height: 40px;
      }
    }

    &__title {
      font-size: 0.875rem;
      font-weight: 500;
    }

    &__info {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.875rem;

      ${(props) =>
        props.$infoVar === 'secondary' &&
        css`
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 0;
          height: 100%;
          padding: 1rem 0;

          @media ${mediaQueries.TABLET} {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.875rem;
          }
        `}

      &-label {
        font-size: 0.875rem;
        font-weight: 400;
        color: ${getColorCarry('secondary2_v2')};

        @media ${mediaQueries.TABLET} {
          font-size: 1.125rem;
          font-weight: 400;
        }
      }

      &-value {
        font-size: 0.875rem;
        font-weight: 500;

        & span {
          font-size: 0.75rem;
          font-weight: 400;
          color: ${getColorCarry('secondary2_v2')};
        }

        @media ${mediaQueries.TABLET} {
          font-size: 1rem;
          font-weight: 400;

          & span {
            font-size: 0.625rem;
          }
        }
      }
    }
  }
`

export const InputStyles = styled(Input)`
  @media ${mediaQueries.TABLET} {
    & .input__input {
      height: 70px;
      border: 0;
      background-color: ${getColorCarry('secondary3_v2')};
      font-size: 1.125rem;
    }
  }
`
