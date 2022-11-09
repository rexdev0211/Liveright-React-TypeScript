import { Form, Formik, FormikHelpers } from 'formik'
import React, { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import * as Yup from 'yup'

import logoCompact from '../../../assets/media/logo-compact.png'
import ButtonSubmit from '../../../components/forms/button-submit/button-submit.component'
import FormInputLabeled from '../../../components/forms/form-input-labeled/form-input-labeled.component'
import FormPassword from '../../../components/forms/form-password/form-password.component'
import FormRadio from '../../../components/forms/form-radio-button/form-radio-button.component'
import FormSwitch from '../../../components/forms/form-switch/form-switch.component'
import { genderTypes } from '../../../enums/gender-types'
import { Routes } from '../../../enums/routes.enum'
import userTypes from '../../../enums/user-types.enum'
import { onlyGuest } from '../../../guards/guest.guard'
import { handleError } from '../../../managers/api.manager'
import logger from '../../../managers/logger.manager'
import { AuthFormContext } from '../../../modules/auth/auth.context'
import {
  AuthFormFieldsType,
  AuthFormTypeNotNull
} from '../../../modules/auth/auth-form.type'
import { useTranslation } from '../../../modules/i18n/i18n.hook'
import { ACTION_REGISTER_REQUEST } from '../../../store/action-types'
import Styles, { Logo, SwitchState, Title, Wrapper } from '../styles'

type LoginDataType = {
  type: string
  first_name: string
  last_name: string
  email: string
  password: string
  gender: string
}
const SignUp = () => {
  const { t } = useTranslation()
  const { form, update } = useContext(AuthFormContext) as AuthFormTypeNotNull
  const [isSubmitted, setIsSubmitted] = useState(false)
  const dispatch = useDispatch()
  const handleSubmit = (
    form: LoginDataType,
    helpers: FormikHelpers<AuthFormFieldsType>
  ) => {
    logger.info('submitting form', form)
    const { first_name, last_name, email, password, type, gender } = form
    const handleSuccess = () => {
      helpers.setSubmitting(false)
      setIsSubmitted(true)
    }
    dispatch({
      type: ACTION_REGISTER_REQUEST,
      payload: {
        first_name,
        last_name,
        email,
        password,
        gender,
        password_confirmation: password,
        account_type: type,
        onSuccess: handleSuccess,
        onError: handleError(helpers)
      }
    })
  }
  const userTypeOptions = [
    { label: 'Client', value: userTypes.CLIENT },
    { label: 'Trainer', value: userTypes.TRAINER }
  ]
  const genderOptions = [
    { label: 'Male', value: genderTypes.MALE },
    { label: 'Female', value: genderTypes.FEMALE }
  ]
  if (isSubmitted) return <Redirect to={Routes.REGISTER_CONFIRMATION} />
  return (
    <Styles>
      <Wrapper>
        <Logo alt={'liveright'} src={logoCompact} />
        <Title>
          <div className={'title__hr'} />
          <h1 className={'title__h1'}>{t('auth:sign-up-title')}</h1>
          <h2 className={'title__h2'}>{t('auth:sign-up-subtitle')}</h2>
        </Title>
        <Formik
          initialValues={form}
          onSubmit={handleSubmit}
          validationSchema={Yup.object({
            type: Yup.string().required(),
            first_name: Yup.string().required().name().trim(),
            last_name: Yup.string().required().name().trim(),
            email: Yup.string().required().email().trim(),
            password: Yup.string().required().min(8).password()
          })}
        >
          {() => (
            <Form>
              <FormSwitch name={'type'} options={userTypeOptions} />
              <div className={'sign-up__name'}>
                <FormInputLabeled
                  name={'first_name'}
                  label={'First Name'}
                  onUpdate={update}
                />
                <FormInputLabeled
                  name={'last_name'}
                  label={'Last Name'}
                  onUpdate={update}
                />
              </div>
              <FormRadio
                name={'gender'}
                label={"What's your gender?"}
                options={genderOptions}
              />
              <FormInputLabeled
                name={'email'}
                label={'Email'}
                onUpdate={update}
              />
              <FormPassword
                name={'password'}
                label={'Create a password'}
                onUpdate={update}
              />
              {/*<FormInputLabeled type={'password'} name={'password'} label={'Create a password'} onUpdate={update}/>*/}
              <ButtonSubmit>{t('auth:sign-up')}</ButtonSubmit>
            </Form>
          )}
        </Formik>
        <SwitchState>
          {t('auth:have-account')}{' '}
          <Link to={Routes.LOGIN}>{t('auth:sign-in')}</Link>
        </SwitchState>
      </Wrapper>
    </Styles>
  )
}

export default onlyGuest(SignUp)
