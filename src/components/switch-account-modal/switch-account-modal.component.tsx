import React, { useMemo, useState } from 'react'

import AccountActions from '../../enums/account-actions.enum'
import { useTranslation } from '../../modules/i18n/i18n.hook'
import Modal from '../modal/modal.component'
import AddAccount from './add-account/add-account.component'
import SwitchAccount from './switch-account/switch-account.component'
import SwitchAccountModalContext from './switch-account-modal.context'
import Styles from './switch-account-modal.styles'
import SwitchAccountModalHeader from './switch-account-modal-header/switch-account-modal-header.component'

type Props = {
  isOpen: boolean
  onClose: () => void
  action?: AccountActions
}
const SwitchAccountModal = ({ isOpen, onClose, action }: Props) => {
  const [state, setState] = useState<AccountActions>(
    action || AccountActions.SWITCH_ACCOUNT
  )
  const { t } = useTranslation()
  const title = useMemo(
    () =>
      state === AccountActions.SWITCH_ACCOUNT
        ? 'menu.switch-account'
        : 'menu.select-profile-type',
    [state]
  )
  return (
    <Modal
      visible={isOpen}
      onCancel={() => {
        setState(action || AccountActions.SWITCH_ACCOUNT)
        onClose()
      }}
    >
      <Styles>
        <SwitchAccountModalHeader title={t(title)} />
        <SwitchAccountModalContext.Provider
          value={{
            setState: (state: AccountActions) => setState(action || state),
            onClose
          }}
        >
          <div className={'swa__wrapper'} style={{ right: `${state * 100}%` }}>
            <SwitchAccount />
            <AddAccount />
          </div>
        </SwitchAccountModalContext.Provider>
      </Styles>
    </Modal>
  )
}

export default SwitchAccountModal
