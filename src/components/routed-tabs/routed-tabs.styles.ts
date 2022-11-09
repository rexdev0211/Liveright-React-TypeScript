import styled, { css } from 'styled-components'

import { mediaQueries } from '../../enums/screen-sizes.enum'
import { WhiteCard } from '../../pages/progress-log/log-health-data/log-health-data-mobile/log-health-data-mobile.styles'
import { getColorCarry } from '../../pipes/theme-color.pipe'

export default styled(WhiteCard)<any>`
  max-width: 100%;
  overflow-y: auto;
  display: flex;
  padding: 0;
  border-radius: 10px;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  .tabs {
    &__content {
      width: max-content;
      min-width: 100%;
      display: flex;

      @media ${mediaQueries.TABLET} {
        justify-content: center;
      }
    }

    &__wrapper {
      display: flex;
      position: relative;
      padding: 0 1.75rem;
      width: max-content;

      @media ${mediaQueries.TABLET} {
        padding: 0 1rem;

        ${(props) =>
          props.$variant === 'secondary' &&
          css`
            width: 100%;
            justify-content: space-around;
          `}
      }
    }

    &__item {
      display: block;
      color: ${getColorCarry('primaryDark_v2')};
      transition: ${(p) => p.theme.vars.defaults.transition};
      font-weight: 500;
      font-size: 0.875rem;
      line-height: 1.125rem;
      white-space: nowrap;

      @media ${mediaQueries.TABLET} {
        ${(props) =>
          props.$variant === 'secondary' &&
          css`
            color: ${getColorCarry('secondary2_v2')};
          `}
      }

      &:hover {
        color: ${getColorCarry('link')};
      }

      &__active {
        color: ${getColorCarry('link')};
        font-weight: 700;
      }

      &__wrapper {
        padding: 1rem 0;
        margin: 0 0.5rem;

        @media ${mediaQueries.TABLET} {
          ${(props) =>
            props.$variant === 'secondary' &&
            css`
              padding: 1.5rem 0;
            `}
        }
      }
    }

    &__indicator {
      display: ${(props) => (props.$indicator ? 'block' : 'none')};
      transition: ${(p) => p.theme.vars.defaults.transition};
      position: absolute;
      background-color: ${getColorCarry('link')};
      height: 2px;
      width: calc(var(--w));
      left: calc(var(--l));
      bottom: 0;
    }
  }
`
