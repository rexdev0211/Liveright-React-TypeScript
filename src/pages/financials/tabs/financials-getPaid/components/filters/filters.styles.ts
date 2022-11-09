import styled from 'styled-components'

import { mediaQueries } from '../../../../../../enums/screen-sizes.enum'

export const Styles = styled.div`
  display: flex;
  //margin-bottom: 1.625rem;

  .invoice-filters {
    &__search {
      width: 320px;
      margin-right: 1.25rem;

      @media ${mediaQueries.MOBILE} {
        margin-right: 0.75rem;
      }
    }

    &__status {
      width: 200px;
      margin-right: 1.25rem;
    }

    &__user {
      width: 200px;
    }

    &__filter-btn {
      background-color: #fff;
    }
  }
`

export const DrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.25rem;

  & .invoice-filters__status {
    margin-bottom: 1rem;
  }

  & .invoice-filters__user {
    margin-bottom: 1.875rem;
  }
`
