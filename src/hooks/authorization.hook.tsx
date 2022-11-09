import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { EP_GET_USER } from '../enums/api.enum'
import api from '../managers/api.manager'
import cookieManager from '../managers/cookie.manager'
import { ACTION_LOGIN_SUCCESS } from '../store/action-types'
import { unblockCookies } from '../utils/cookie'
import { useEvent } from './event.hook'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type IframeEventType = {
  event: string
  key: string
  [key: string]: any
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const messages = {
  CHECK_LOGIN: 'check_login',
  DO_LOGIN: 'do_login'
}

export type GenderType = 'male' | 'female' | 'other'
export type AccountTypeType = 'client' | 'trainer' | 'org' | 'admin'
export type AccountType = {
  id: number
  uuid: string
  type: AccountTypeType
  is_active: true
  last_used_at: string | null
  account_level: string | null
  is_current: boolean
  profile: null | string
}
export type AuthObjectType = {
  uuid: string
  first_name: string
  last_name: string
  email: string
  email_verified_at: string | null
  is_active: boolean
  birthday: string | null
  gender: GenderType
  avatar: string | null
  avatar_thumb: string | null
  created_at: string
  accounts: AccountType[]
}

export type AuthResponseType = {
  access_token: string
  user: AuthObjectType
}

export const useAuthorization = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    unblockCookies()
    api
      .get(`${EP_GET_USER}?excludeAdmin=1`)
      .then((res) => res.data.data)
      .then((res) => {
        dispatch({ type: ACTION_LOGIN_SUCCESS, payload: res })
      })
  }, [])

  useEvent('focus', () => {
    const user = cookieManager.get('auth')
    dispatch({
      type: ACTION_LOGIN_SUCCESS,
      payload: user ? JSON.parse(user) : null
    })
  })
}
