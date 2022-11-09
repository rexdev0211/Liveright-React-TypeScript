import styled from 'styled-components'

export default styled.div`
  color: ${(p) => p.theme.vars.colors.primary_v2};
  font-weight: 500;
  cursor: pointer;
  &:hover {
    color: ${(p) => p.theme.vars.colors.primaryLight};
  }
`
