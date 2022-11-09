import styled from 'styled-components'

export default styled.form`
  padding: 14px 35px;
  background-color: white;
  flex-shrink: 0;
  display: flex;
  z-index: 11;

  &.popup {
    padding: 14px;
  }
  @media all and (max-width: ${(p) => p.theme.vars.media.tablet}px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 14px;
  }
`
