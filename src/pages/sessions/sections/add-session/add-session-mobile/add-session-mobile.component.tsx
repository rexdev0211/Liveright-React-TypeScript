import React from 'react'

import { SessionType } from '../../../../../types/session.type'
import AddSessionFieldsMobile from '../add-session-fields-mobile/add-session-fields-mobile.component'
import AddSessionForm from '../add-session-form/add-session-form.component'
import AddSessionTop from '../add-session-top/add-session-top.component'
import Styles from './add-session-mobile.styles'

type Props = {
  onClose: () => void
  session?: SessionType
  onCredits?: (credits: number) => void
}

const AddSessionMobile = ({ onClose, session, onCredits }: Props) => {
  return (
    <Styles>
      <AddSessionForm onClose={onClose} session={session}>
        <AddSessionTop session={session} onCredits={onCredits} />
        <AddSessionFieldsMobile onClose={onClose} session={session} />
      </AddSessionForm>
    </Styles>
  )
}

export default AddSessionMobile
