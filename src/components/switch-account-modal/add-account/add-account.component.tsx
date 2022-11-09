import React, { useContext } from 'react'
import { useDispatch } from 'react-redux'

import AccountActions from '../../../enums/account-actions.enum'
import { useAuth } from '../../../hooks/auth.hook'
import logger from '../../../managers/logger.manager'
import { classes } from '../../../pipes/classes.pipe'
import { ACTION_ADD_ACCOUNT_REQUEST } from '../../../store/action-types'
import Card from '../../card/card.style'
import { toast } from '../../toast/toast.component'
import SwitchAccountModalContext from '../switch-account-modal.context'
import Styles from './add-account.styles'

const types: string[] = ['Trainer', 'Client']
const AddAccount = () => {
  const { onClose, setState } = useContext(SwitchAccountModalContext)
  const { accounts } = useAuth()
  const dispatch = useDispatch()
  const switchAccount = (type: string) => {
    logger.info('ADDING ACCOUNT', type)
    dispatch({
      type: ACTION_ADD_ACCOUNT_REQUEST,
      payload: {
        type,
        onSuccess: () => {
          onClose()
          setState(AccountActions.SWITCH_ACCOUNT)
          toast.show({ type: 'success', msg: 'Account created!' })
        },
        onError: () => {
          onClose()
          setState(AccountActions.SWITCH_ACCOUNT)
        }
      }
    })
  }
  logger.info('ACCOUNTS', accounts)
  return (
    <Styles>
      {types.map((type) => (
        // eslint-disable-next-line react/jsx-key
        <Card
          className={classes(
            'add-account__type',
            accounts.some((a) => a.type === type.toLowerCase()) &&
              'add-account__type__disabled'
          )}
          onClick={
            accounts.some((a) => a.type === type.toLowerCase())
              ? undefined
              : () => switchAccount(type.toLowerCase())
          }
        >
          {type}
        </Card>
      ))}
    </Styles>
  )
}

export default AddAccount
