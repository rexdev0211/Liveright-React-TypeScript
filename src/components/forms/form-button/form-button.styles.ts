import { Button } from 'antd'
import styled from 'styled-components'

export default styled(Button)`
  border-radius: ${(p) => p.theme.vars.sizes.borderRadius};
  padding: 15px 30px;
  height: auto;
  width: 100%;
  font-weight: 600;
  transition: ${(p) => p.theme.vars.defaults.transition};
  font-family: ${(p) => p.theme.vars.defaults.font};
  box-shadow: 0px 4px 8px 1px rgba(242, 96, 96, 0.15);
  &.ant-btn-primary {
    background-color: ${(p) => p.theme.vars.colors.primary_v2};
    color: white;
    border-color: ${(p) => p.theme.vars.colors.primary_v2};
    &:hover {
      border-color: ${(p) => p.theme.vars.colors.primaryLight};
      background-color: ${(p) => p.theme.vars.colors.primaryLight};
    }
    &:disabled {
      border-color: ${(p) => p.theme.vars.colors.light};
      background-color: ${(p) => p.theme.vars.colors.light};
      color: #bfbfbf;
    }
  }
  &.ant-btn-default {
    color: rgba(0, 0, 0, 0.3);
    background: white;
    &:hover {
      background: white;
      color: rgba(0, 0, 0, 0.5);
      border-color: rgba(0, 0, 0, 0.5);
    }
    &:disabled {
      background: white;
      color: ${(p) => p.theme.vars.colors.light};
      border-color: ${(p) => p.theme.vars.colors.light};
    }
  }
  &.ant-btn-link {
    border-color: transparent;
    background: transparent;
    box-shadow: none;
    color: ${(p) => p.theme.vars.colors.primary_v2};
    &:hover {
      color: ${(p) => p.theme.vars.colors.primaryLight};
    }
    &:disabled {
      color: ${(p) => p.theme.vars.colors.light};
    }
  }
  &.ant-btn-ghost {
    box-shadow: none;
    border: 1px solid ${(p) => p.theme.vars.colors.labelLight};
    color: ${(p) => p.theme.vars.colors.labelLight};
    &:hover {
      border: 1px solid ${(p) => p.theme.vars.colors.primaryDark};
      color: ${(p) => p.theme.vars.colors.primaryDark};
    }
  }
  &.ant-btn-text {
    box-shadow: none;
    border: 1px solid ${(p) => p.theme.vars.colors.link};
    color: ${(p) => p.theme.vars.colors.link};
    background-color: white;
    padding: 4px 12px;
    font-size: 14px;
    font-weight: 400;
    &:hover {
      background-color: white;
      border: 1px solid ${(p) => p.theme.vars.colors.link_lighten};
      color: ${(p) => p.theme.vars.colors.link_lighten};
    }
  }
`
