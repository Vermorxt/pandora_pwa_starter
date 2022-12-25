import axios, { AxiosError } from 'axios'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { formIsValid, Ui_Alert, Ui_Button, Ui_Card, Ui_Flex, useSubmit } from '@vermorxt/pandora_ui'
import { Ui_Form } from '@vermorxt/pandora_ui'
import { ApiEndpoints } from './../../../src/_enums/api-endpoints'
import { HttpStatus } from '../../../src/_enums/http-status'
import { AnyType } from '../../../src/_types/anytype'
import { Helper } from '@vermorxt/pandora_utils'
import ApiErrorHandler from '../../../src/components/ApiErrorHandler'
import { cancellableAxios } from '../../../src/axios/axios.interceptor copy'
import { login } from '../../../src/axios/auth'
import { AxiosErrorInterface } from '../../../src/_types/api-endpoints'
import { ApiAuthDefinition } from '../../../src/_enums/api-auth-definition'

export interface ValidationOptions {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: string | RegExp
  valueAsNumber?: boolean
}

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

export type FormFieldTypes = 'text' | 'password' | 'email' | 'textarea' | 'toggle' | 'radio' | 'checkbox'

export type formError = { [key: string]: { message: string } }
export type formErrors = formError[]

export interface InitialFormValues {
  name: string
  value: string | number
  label: string
  type: FormFieldTypes // NOTE: use not InputHTMLAttributes<HTMLInputElement> for now because validation handled by browser otherwise
  validation: ValidationOptions
}

const Login = () => {
  const { t } = useTranslation('login')

  const [formErrors, setFormErrors] = useState<formErrors>()
  const [finishedUpdate, setFinishedUpdate] = useState<boolean>(false)

  const [showError, setShowError] = useState(false)
  const [loginFailed, setLoginFailed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordHidden, setPasswordHidden] = useState(true)

  // const formInitialValues = [
  //   {
  //     name: 'email',
  //     value: '',
  //     label: t('label_email'),
  //     type: 'email',
  //     validation: { minLength: 3, required: true, pattern: getEmailPattern() },
  //   },
  //   {
  //     name: 'password',
  //     value: '',
  //     label: t('label_password'),
  //     type: 'password',
  //     validation: { minLength: 3, required: true },
  //   },
  //   {
  //     name: 'testNum',
  //     value: null,
  //     label: 'Test Number',
  //     type: 'text',
  //     validation: { valueAsNumber: true, required: true },
  //   },
  //   {
  //     name: 'testUrl',
  //     type: 'text',
  //     label: 'Url',
  //     validation: { url: true, required: true },
  //   },
  //   {
  //     name: 'range',
  //     type: 'range',
  //     label: 'Range',
  //     min: '0',
  //     max: '100',
  //     value: null,
  //     step: '10',
  //     validation: { required: true, minLength: 20, maxLength: 60 },
  //   },
  //   {
  //     name: 'area',
  //     type: 'textarea',
  //     label: 'Text area',
  //     validation: { required: true, minLength: 10 },
  //   },
  //   {
  //     name: 'toggle1',
  //     type: 'toggle',
  //     label: 'Toggle',
  //     value: false,
  //     validation: { required: true },
  //   },
  //   {
  //     name: 'checkbox',
  //     type: 'checkbox',
  //     label: 'Checkbox',
  //     value: null,
  //     validation: { required: true },
  //   },
  //   {
  //     name: 'radio',
  //     type: 'radio',
  //     label: 'Radio',
  //     value: '',
  //     radioOptions: ['blue', 'green', 'red'],
  //     validation: { required: true },
  //   },
  //   {
  //     name: 'select1',
  //     type: 'select',
  //     label: 'Select 1',
  //     value: 'red',
  //     selectOptions: ['blue', 'green', 'red', 'purple', 'black', 'yellow', 'grey'],
  //     disableOptions: ['black', 'grey'],
  //     validation: { required: true },
  //   },
  //   {
  //     name: 'select2',
  //     type: 'select',
  //     label: 'Select 2',
  //     value: '',
  //     selectOptions: ['blue', 'green', 'red', 'purple', 'black', 'yellow', 'grey'],
  //     disableOptions: ['black', 'grey'],
  //     validation: { required: true },
  //   },
  // ] as InitialFormValues[]

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

  const saveData = async (data: AnyType) => {
    console.log('save data: ', data)

    const endPoint = `${process.env.API_URL as string}${ApiEndpoints.Login}`

    const apiResponse = await cancellableAxios({ url: `${endPoint}`, method: 'GET' }).catch(ApiErrorHandler)

    console.log('apiResponse data: ', apiResponse)

    if (apiResponse) {
      console.log('api response succeed', apiResponse)
      setFinishedUpdate(true)

      setTimeout(() => {
        setFinishedUpdate(false)
      }, 500)
    }

    setLoading(false)
  }

  const handleError = (error: AxiosErrorInterface) => {
    setLoading(false)

    if (error?.request?.status === HttpStatus.UNAUTHORIZED) {
      setShowError(false)
      setLoginFailed(true)
    } else {
      setShowError(true)
    }
  }

  const loginUser = async (data: AnyType) => {
    setLoginFailed(false)

    const apiResponse = await axios
      .post(`${process.env.API_URL as string}${ApiAuthDefinition.POST_AUTH}`, JSON.stringify(data))
      .catch((error: AxiosError) => handleError(error))

    if (!apiResponse) return

    const userData = apiResponse as unknown as UserLoginResponse

    console.log('logged in: ', userData)

    setLoading(false)

    // bubbleScalingAfterLogin(() => {
    //   setTimeout(() => {
    //     void login(userData.data, false)

    //     setLoading(false)
    //   }, 500)
    // })

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    void loginUser(values)
  })

  return (
    <>
      <Ui_Flex className="items-center justify-center p-6">
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
                variant={finishedUpdate ? 'success' : 'primary'}
                type="submit"
                name="submit"
                style={{ marginTop: 20 }}
              >
                {t('login')}
              </Ui_Button>
            </Ui_Form>

            {showError && (
              <Ui_Alert error>
                <span>Oh, something went wrong.</span>
              </Ui_Alert>
            )}

            {loginFailed && (
              <Ui_Alert error>
                <span>Oops, email or password does not match.</span>
              </Ui_Alert>
            )}

            <Ui_Card.Actions>
              <p style={{ textAlign: 'center' }}>
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
