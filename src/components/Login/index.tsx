import { Ui_Alert, Ui_Button, Ui_Card, Ui_Flex } from '@vermorxt/pandora_ui'
import { Helper } from '@vermorxt/pandora_utils'
import axios, { AxiosError } from 'axios'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { login, logout } from '../../../src/axios/auth'
import { ApiAuthDefinition } from '../../../src/_enums/api-auth-definition'
import { HttpStatus } from '../../../src/_enums/http-status'
import { AnyType } from '../../../src/_types/anytype'
import { AxiosErrorInterface } from '../../../src/_types/api-endpoints'
import { formIsValid, useSubmit } from '../../modules/form'
import { Ui_Form } from '../../modules/form/hooks/form-context'
import { formErrors } from '../../modules/form/util/form-is-valid'
import { InitialFormValues } from '../../modules/form/_types/form/initial-form-values'
import { GlobalContext, useGlobalContext } from '../../system'

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

const Login = () => {
  const { t } = useTranslation('login')

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
      name: 'email',
      value: '',
      label: t('label_email'),
      type: 'email',
      validation: { minLength: 3, required: true, pattern: Helper.getEmailPattern() },
    },
    {
      name: 'password',
      value: '',
      label: t('label_password'),
      type: 'password',
      validation: { minLength: 3, required: true },
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

  console.log('env: ', process.env.NEXT_PUBLIC_ENVIRONMENT)

  const loginUser = async (data: AnyType) => {
    setLoginFailed(false)
    setFinishedUpdate(false)

    console.log('api url: ', process.env.NEXT_PUBLIC_API_URL)

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

    void loginUser(values as AnyType)
  })

  return (
    <>
      <Ui_Flex className="items-center justify-center p-6" style={{ minHeight: '70vh' }}>
        <Ui_Card id="login-card" bgBase="300" className="w-96">
          <Ui_Card.Body>
            <Ui_Card.Title>{t('login')}</Ui_Card.Title>

            <Ui_Form handleSubmit={handleSubmit} id="login">
              {formInitialValues?.map((initials, i) => (
                <Ui_Form.Field key={i}>
                  <Ui_Form.Element {...{ initials }} formErrors={formErrors} />
                </Ui_Form.Field>
              ))}
              <Ui_Button
                loading={loading}
                size="block"
                className={`${finishedUpdate === true ? 'btn-success' : 'btn-primary'}`}
                type="submit"
                name="submit"
                style={{ marginTop: 20, marginBottom: 10 }}
              >
                {t('login')}
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

            <Ui_Card.Actions>
              <p style={{ textAlign: 'center', marginTop: 15 }}>
                <small>{t('forgot_password')}? </small>
                <Ui_Button variant="ghost" size="mini">
                  reset
                </Ui_Button>
              </p>
            </Ui_Card.Actions>
          </Ui_Card.Body>
        </Ui_Card>
      </Ui_Flex>
    </>
  )
}

export default React.memo(Login)
