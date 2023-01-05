import { Ui_Alert, Ui_Button, Ui_Card, Ui_Flex } from '@vermorxt/pandora_ui'
import { Helper } from '@vermorxt/pandora_utils'
import { AxiosError } from 'axios'
import { useTranslation } from 'next-i18next'
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

export interface UserLoginResponse {
  data?: any
  error?: AxiosError | null
}

const Register = () => {
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

      setRegisterFinished('Wir haben dir eine E-mail mit weiteren Instruktionen gesandt.')
    }, 500)

    setTimeout(() => {
      void router.push('/public/finish-registration')
    }, 3000)
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
    <>
      <Ui_Flex className="items-center justify-center p-6" style={{ minHeight: '70vh' }}>
        <Ui_Card id="login-card" bgBase="300" className="w-96">
          <Ui_Card.Body>
            <Ui_Card.Title>{'Registrierung'}</Ui_Card.Title>

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
                Registrieren
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

            <Ui_Card.Actions>
              <p style={{ textAlign: 'center', marginTop: 15 }}>
                <small>{'Login vorhanden?'} </small>
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

export default React.memo(Register)
