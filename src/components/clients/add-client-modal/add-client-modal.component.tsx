import React, { useState } from 'react'

import { useTranslation } from '../../../modules/i18n/i18n.hook'
import Modal from '../../modal/modal.component'
import {
  ClientFormContext,
  clientFormSteps,
  ClientFormType,
  defaultValues
} from './add-client-modal.context'
import Styles from './add-client-modal.styles'
import AddClientModalEmail from './add-client-modal-email/add-client-modal-email.component'
import AddClientModalForm from './add-client-modal-form/add-client-modal-form.component'
import AddClientModalMessage from './add-client-modal-message/add-client-modal-message.component'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSubmit?: () => void
}

const AddClientModal = ({ isOpen, onClose, onSubmit }: Props) => {
  const [form, setFrom] = useState<ClientFormType>(defaultValues)
  const [step, setStep] = useState<number>(clientFormSteps.EMAIL)
  const { t } = useTranslation()
  const update = (name: string, val: string) =>
    setFrom({
      ...form,
      [name]: val
    })
  const handleClose = () => {
    setStep(clientFormSteps.EMAIL)
    onClose()
  }
  return (
    <ClientFormContext.Provider
      value={{ form, update, step, setStep, onClose: handleClose }}
    >
      <Modal visible={isOpen} onCancel={handleClose}>
        <Styles>
          <h1 className={'add-client__title'}>{t('clients:add')}</h1>
          <div className={'add-client__cont'}>
            <div
              className={'add-client__body'}
              style={{ right: `${Math.min(1, step) * 100}%` }}
            >
              <AddClientModalEmail />
              <AddClientModalMessage onSubmit={onSubmit} />
              <AddClientModalForm onSubmit={onSubmit} />
            </div>
          </div>
        </Styles>
      </Modal>
    </ClientFormContext.Provider>
  )
}

export default AddClientModal
