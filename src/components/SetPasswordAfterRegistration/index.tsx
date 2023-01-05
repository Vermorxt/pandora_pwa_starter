import { Ui_Alert,Ui_Button,Ui_Card,Ui_Flex,Ui_FlexGrow } from '@vermorxt/pandora_ui'
import { Helper } from '@vermorxt/pandora_utils'
import axios,{ AxiosError } from 'axios'
import { useRouter } from 'next/router'
import React,{ useEffect,useState } from 'react'
import { login } from '../../axios/auth'
import { formIsValid,useSubmit } from '../../modules/form'
import { Ui_Form } from '../../modules/form/hooks/form-context'
import { formErrors } from '../../modules/form/util/form-is-valid'
import { InitialFormValues } from '../../modules/form/_types/form/initial-form-values'
import { useGlobalContext } from '../../system'
import { ApiAuthDefinition } from '../../_enums/api-auth-definition'
import { HttpStatus } from '../../_enums/http-status'
import { AnyType } from '../../_types/anytype'
import { AxiosErrorInterface } from '../../_types/api-endpoints'

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

const SetPasswordAfterRegistration = () => {
  const router = useRouter()

  const [formErrors, setFormErrors] = useState<formErrors>()
  const [finishedUpdate, setFinishedUpdate] = useState<boolean>(false)

  const [showError, setShowError] = useState(false)
  const [succeedSetPassword, setSucceedSetPassword] = useState(false)
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
    setSucceedSetPassword(true)
    setLoading(false)

    setTimeout(() => {
      setFinishedUpdate(true)

      void router.push('/public/login/')
    }, 3000)

    return

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
    <>
      <Ui_Flex className="items-center justify-center p-6" style={{ minHeight: '70vh' }}>
        <Ui_Card id="login-card" bgBase="300" className="w-96">
          <Ui_Card.Body>
            <Ui_Card.Title>Passwort festlegen</Ui_Card.Title>
            <p>Bitte lege dein Passwort fest!</p>
            <Ui_Form handleSubmit={handleSubmit} formInitialValues={formInitialValues} id="login">
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
            {succeedSetPassword && (
              <Ui_Alert variant="success">
                <span>Super, das hat geklappt. Bitte logge dich ein!</span>
              </Ui_Alert>
            )}
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
                <small>Login vorhanden? </small>
                <Ui_Button variant="ghost" size="mini" onClick={() => void router.push('/public/login')}>
                  login
                </Ui_Button>
              </p>
            </Ui_Card.Actions>
          </Ui_Card.Body>
        </Ui_Card>
      </Ui_Flex>
    </>
  )
}

export default React.memo(SetPasswordAfterRegistration)
