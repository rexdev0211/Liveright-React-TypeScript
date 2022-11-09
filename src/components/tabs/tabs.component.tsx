import { Tabs as AntdTabs } from 'antd'
import { TabsPosition } from 'antd/es/tabs'
import React, { ReactElement } from 'react'

import { LabelWrapper, Styles } from './tabs.styles'

interface Props {
  className?: string
  tabPosition?: TabsPosition
  activeKey?: string
  onChange?: (key: string) => void
  justify?: 'between'
  tabs: {
    icon?: ReactElement
    key?: string
    label?: string
    renderContent: () => ReactElement
  }[]
}

const Tabs: React.FC<Props> = (props) => {
  const { tabs, tabPosition, activeKey, onChange, className, justify } = props

  return (
    <Styles
      $justify={justify}
      className={className}
      tabPosition={tabPosition}
      activeKey={activeKey}
      onChange={onChange}
      destroyInactiveTabPane
    >
      {tabs.map(({ label, icon, key, renderContent }) => {
        const tab = icon ? (
          <LabelWrapper className="tabs-label-wrapper">
            {icon}
            {label}
          </LabelWrapper>
        ) : (
          label
        )

        return (
          <AntdTabs.TabPane tab={tab} key={key || label}>
            {renderContent()}
          </AntdTabs.TabPane>
        )
      })}
    </Styles>
  )
}

export default Tabs
