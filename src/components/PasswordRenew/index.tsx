import { Ui_Alert, Ui_Button, Ui_Card } from '@vermorxt/pandora_ui'
import { Helper } from '@vermorxt/pandora_utils'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { login } from '../../../src/axios/auth'
import { ApiAuthDefinition } from '../../../src/_enums/api-auth-definition'
import { HttpStatus } from '../../../src/_enums/http-status'
import { AnyType } from '../../../src/_types/anytype'
import { AxiosErrorInterface } from '../../../src/_types/api-endpoints'
import { formIsValid, useSubmit } from '../../modules/form'
import { Ui_Form } from '../../modules/form/hooks/form-context'
import { formErrors } from '../../modules/form/util/form-is-valid'
import { InitialFormValues } from '../../modules/form/_types/form/initial-form-values'
import { useGlobalContext } from '../../system'
import LogoPublic from '../LogoPublic'
import scss from './password-renew.module.scss'

export interface ProductRole {
  product: string
  role: string
}
export interface UserLogin {
  token?: string
  name: string
  isSuperAdmin: boolean
  roles: ProductRole[]
  profileImageUrl?: string
  currentProductRole?: string
}

export interface UserLoginResponse {
  data?: UserLogin
  error?: AxiosError | null
}

const PasswordRenew = () => {
  const router = useRouter()

  const [formErrors, setFormErrors] = useState<formErrors>()
  const [finishedUpdate, setFinishedUpdate] = useState<boolean>(false)

  const [showError, setShowError] = useState(false)
  const [loginFailed, setLoginFailed] = useState(false)
  const [loading, setLoading] = useState(false)

  const [userData, setUserData] = useGlobalContext().userData

  useEffect(() => {
    // void logout()
  }, [])

  const formInitialValues = [
    {
      name: 'password',
      value: '',
      label: 'Passwort',
      type: 'password',
      validation: { minLength: 3, required: true },
    },
    {
      name: 'password_repeat',
      value: '',
      label: 'Passwort wiederholen',
      type: 'password',
      validation: { minLength: 3, required: true, match: 'password' },
    },
  ] as InitialFormValues[]

  const handleError = (error: AxiosErrorInterface) => {
    setLoading(false)

    if (error?.request?.status === HttpStatus.UNAUTHORIZED) {
      setShowError(false)
      setLoginFailed(true)
    } else {
      setShowError(true)
    }
  }

  const resetPassword = async (data: AnyType) => {
    setLoginFailed(false)
    setFinishedUpdate(false)

    const apiResponse = await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL as string}${ApiAuthDefinition.POST_AUTH}`, JSON.stringify(data))
      .catch((error: AxiosError) => handleError(error))

    if (!apiResponse) return

    const userData = apiResponse as unknown as UserLoginResponse

    setUserData({ ...userData?.data })

    setLoading(false)
    setFinishedUpdate(true)

    setTimeout(() => {
      void login(userData.data, false)

      setLoading(false)
    }, 500)
  }

  const handleSubmit = useSubmit((values, errors, touched) => {
    setLoading(true)
    setShowError(false)
    setLoginFailed(false)

    const checkForm = formIsValid(values, formInitialValues)

    if (checkForm.errors.length > 0 || errors?.length > 0) {
      setFormErrors([...checkForm.errors])
      setLoading(false)

      setTimeout(() => {
        const errorFields = document.querySelectorAll("[type='error']") as unknown as NodeListOf<Element>
        if (errorFields) Helper.scrollToExistingElement(errorFields[0])
      }, 300)

      return
    }

    void resetPassword(values as AnyType)
  })

  return (
    <div className={scss.wrapper}>
      <div className={scss.header}>
        <LogoPublic cleanLogo={true} style={{ width: 70 }} />
        <h2>Passwort erneuern</h2>
        <p className="_font-small">Bitte gib dein neues Passwort ein! </p>
      </div>
      <div>
        <Ui_Form handleSubmit={handleSubmit} formInitialValues={formInitialValues} id="password-renew">
          <Ui_Button
            loading={loading}
            size="block"
            className={`${finishedUpdate === true ? 'btn-success' : 'btn-primary'}`}
            type="submit"
            name="submit"
            style={{ marginTop: 20, marginBottom: 10 }}
          >
            Speichern
          </Ui_Button>
        </Ui_Form>
        {showError && (
          <Ui_Alert variant="error">
            <span>Oh, something went wrong.</span>
          </Ui_Alert>
        )}
        {loginFailed && (
          <Ui_Alert variant="error">
            <span>Oops, email or password does not match.</span>
          </Ui_Alert>
        )}
      </div>{' '}
      <p style={{ textAlign: 'center', marginTop: 15 }}>
        <small>Login vorhanden? </small>
        <Ui_Button type="button" variant="ghost" size="mini" onClick={() => void router.push('/public/login')}>
          Login
        </Ui_Button>
      </p>
    </div>
  )
}

export default React.memo(PasswordRenew)
