import { Ui_Alert, Ui_Button } from '@vermorxt/pandora_ui'
import { Helper } from '@vermorxt/pandora_utils'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { HttpStatus } from '../../../src/_enums/http-status'
import { AnyType } from '../../../src/_types/anytype'
import { AxiosErrorInterface } from '../../../src/_types/api-endpoints'
import { formIsValid, useSubmit } from '../../modules/form'
import { Ui_Form } from '../../modules/form/hooks/form-context'
import { formErrors } from '../../modules/form/util/form-is-valid'
import { InitialFormValues } from '../../modules/form/_types/form/initial-form-values'
import { useGlobalContext } from '../../system'
import LogoPublic from '../LogoPublic'
import scss from './forgot-password.module.scss'

export interface UserLoginResponse {
  data?: any
  error?: AxiosError | null
}

const ForgotPassword = () => {
  const router = useRouter()

  const [formErrors, setFormErrors] = useState<formErrors>()
  const [finishedUpdate, setFinishedUpdate] = useState<boolean>(false)

  const [showError, setShowError] = useState(false)
  const [registerFailed, setRegisterFailed] = useState(false)
  const [registerFinished, setRegisterFinished] = useState<string>()
  const [loading, setLoading] = useState(false)

  const [userData, setUserData] = useGlobalContext().userData

  useEffect(() => {
    // void logout()
  }, [])

  const formInitialValues = [
    {
      name: 'email',
      value: '',
      label: 'E-Mail',
      type: 'email',
      validation: { minLength: 3, required: true, pattern: Helper.getEmailPattern() },
    },
  ] as InitialFormValues[]

  const handleError = (error: AxiosErrorInterface) => {
    setLoading(false)

    if (error?.request?.status === HttpStatus.UNAUTHORIZED) {
      setShowError(false)
      setRegisterFailed(true)
    } else {
      setShowError(true)
    }
  }

  const registerUser = (data: AnyType) => {
    setRegisterFailed(false)
    setFinishedUpdate(false)

    // const apiResponse = await axios
    //   .post(`${process.env.NEXT_PUBLIC_API_URL as string}${ApiAuthDefinition.POST_AUTH}`, JSON.stringify(data))
    //   .catch((error: AxiosError) => handleError(error))

    // if (!apiResponse) return

    // const userData = apiResponse as unknown as UserLoginResponse

    setLoading(false)
    setFinishedUpdate(true)

    setTimeout(() => {
      setLoading(false)

      setRegisterFinished('We sent you an email with further instructions.')
    }, 500)
  }

  const handleSubmit = useSubmit((values, errors, touched) => {
    setLoading(true)
    setShowError(false)
    setRegisterFailed(false)

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

    void registerUser(values as AnyType)
  })

  return (
    <div className={scss.wrapper}>
      <div className={scss.header}>
        <LogoPublic cleanLogo={true} style={{ width: 70 }} />
        <h2>Passwort zurücksetzen</h2>
        <p className="_font-small">
          Bitte trage deine E-Mail Adresse ein. Wir senden Dir eine E-Mail mit weiteren Instruktionen wie du dein
          Passwort zurücksetzen kannst.
        </p>
      </div>
      <div>
        <Ui_Form handleSubmit={handleSubmit} formInitialValues={formInitialValues} id="login">
          <Ui_Button
            loading={loading}
            size="block"
            className={`${finishedUpdate === true ? 'btn-success' : 'btn-primary'}`}
            type="submit"
            name="submit"
            style={{ marginTop: 20, marginBottom: 10 }}
          >
            Absenden
          </Ui_Button>
        </Ui_Form>

        {showError && (
          <Ui_Alert variant="error">
            <span>Oh, something went wrong.</span>
          </Ui_Alert>
        )}

        {registerFailed && (
          <Ui_Alert variant="error">
            <span>Oops, registration failed.</span>
          </Ui_Alert>
        )}

        {registerFinished && (
          <Ui_Alert variant="success">
            <span>{registerFinished}</span>
          </Ui_Alert>
        )}
      </div>
      <p style={{ textAlign: 'center', marginTop: 15 }}>
        <small>Login vorhanden? </small>
        <Ui_Button type="button" variant="ghost" size="mini" onClick={() => void router.push('/public/login')}>
          Login
        </Ui_Button>
      </p>
    </div>
  )
}

export default React.memo(ForgotPassword)
