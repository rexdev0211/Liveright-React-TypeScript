import styled, { css } from 'styled-components'

import { getColorCarry } from '../../../../../../pipes/theme-color.pipe'

export const Styles = styled.div<any>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.cardio
      ? '46px 1fr 1fr 1fr 46px'
      : '46px 2fr 1fr 1fr 1fr 1fr 3fr 46px'};
  gap: 1rem;
  padding: 0.75rem 0 0.75rem 0;
  background-color: ${getColorCarry('neutral_10')};
  border-radius: 15px;
  position: relative;
  margin: 10px 0;

  & label {
    white-space: nowrap;
  }

  ${(props) =>
    props.$isDragging &&
    css`
      border: 1px dashed ${getColorCarry('orange_60')};
    `};

  ${(props) =>
    props.$prefix &&
    css`
      margin-top: 1rem;
    `};

  .Exercise {
    &__prefix {
      margin-top: 0;
      position: absolute;
      top: -1.5rem;
    }

    &__delete {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;

      &-btn {
        color: ${getColorCarry('red')};
      }
    }

    &__drag {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      &-btn {
        height: 44px;
        width: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-color: transparent;
        border: 0;
        color: ${getColorCarry('secondary2_v2')};
      }
    }

    &__checkbox {
      margin: 0 0.75rem;

      &-container {
        display: flex;
        align-items: center;
        margin-left: 4rem;
      }
    }
  }

  .exercise-input {
    display: flex;
    align-items: center;

    &__prefix {
      width: 40px;
      margin-top: 25px;
    }
  }
`
