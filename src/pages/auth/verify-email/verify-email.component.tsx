import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect, useLocation, useParams } from 'react-router-dom'

import { Routes } from '../../../enums/routes.enum'
import { onlyGuest } from '../../../guards/guest.guard'
import logger from '../../../managers/logger.manager'
import { VerifyEmailParamsType } from '../../../modules/auth/verify-email-params.type'
import { ACTION_VERIFY_EMAIL_REQUEST } from '../../../store/action-types'

enum verifiedState {
  NONE,
  SUCCESS,
  ERROR
}
const VerifyEmail = () => {
  const { id, token } = useParams<VerifyEmailParamsType>()
  const [verified, setVerified] = useState<verifiedState>(verifiedState.NONE)
  const location = useLocation()
  const dispatch = useDispatch()
  useEffect(() => {
    logger.info('PARAMS', id, token, location.search)
    if (id && token) {
      const query = new URLSearchParams(location.search)
      dispatch({
        type: ACTION_VERIFY_EMAIL_REQUEST,
        payload: {
          id,
          token,
          expires: query.get('expires'),
          signature: query.get('signature'),
          onSuccess: () => {
            setVerified(verifiedState.SUCCESS)
          },
          onError: () => {
            setVerified(verifiedState.ERROR)
          }
        }
      })
    }
  }, [])
  // if(verified === verifiedState.SUCCESS)
  //     return <Redirect to={Routes.REGISTER_ON_BOARD}/>;
  if (verified === verifiedState.ERROR) return <Redirect to={Routes.LOGIN} />
  return <div />
}

export default onlyGuest(VerifyEmail)
