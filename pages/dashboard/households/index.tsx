import { Ui_Button, Ui_Modal } from '@vermorxt/pandora_ui'
import { Helper } from '@vermorxt/pandora_utils'
import React, { useState } from 'react'
import { formIsValid, useSubmit } from '../../../src/modules/form'
import { Ui_Form } from '../../../src/modules/form/hooks/form-context'
import { InitialFormValues } from '../../../src/modules/form/_types/form/initial-form-values'

const HouseholdsPage = () => {
  const [showError, setShowError] = useState(false)
  const [loginFailed, setLoginFailed] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)

  const formInitialValues = [
    {
      name: 'name',
      value: '',
      label: 'Name',
      type: 'text',
      validation: { minLength: 3, required: true },
    },
    {
      name: 'address',
      value: '',
      label: 'Adresse',
      type: 'text',
      validation: { minLength: 3, required: true },
    },
  ] as InitialFormValues[]

  const handleSubmit = useSubmit((values, errors, touched) => {
    setLoading(true)
    setShowError(false)
    setLoginFailed(false)

    console.log('values: ', values)

    const checkForm = formIsValid(values, formInitialValues)

    if (checkForm.errors.length > 0 || errors?.length > 0) {
      setLoading(false)

      console.log('add haushalt error')

      setTimeout(() => {
        const errorFields = document.querySelectorAll("[type='error']") as unknown as NodeListOf<Element>
        if (errorFields) Helper.scrollToExistingElement(errorFields[0])
      }, 300)

      return
    }

    setLoading(false)
    console.log('add haushalt')
  })

  return (
    <div>
      <h1>Haushalte</h1>
      <div style={{ marginTop: 20 }}>
        <Ui_Modal
          closeClickOutside={false}
          id="modal_1"
          size="large"
          buttonText="Haushalt hinzufügen"
          labelStyle={{ width: '100%' }}
          labelClassName="btn btn-primary btn-outline"
          className="custom"
        >
          <>
            <h1>Neuer haushalt</h1>
            <p>Bitte bestimme einen Namen und den Standort!</p>
            <Ui_Form handleSubmit={handleSubmit} formInitialValues={formInitialValues} id="login">
              {formInitialValues?.map((initials, i) => (
                <Ui_Form.Field key={i}>
                  <Ui_Form.Element {...{ initials }} />
                </Ui_Form.Field>
              ))}
              <Ui_Button
                disabled={disabled}
                htmlFor="login"
                type="submit"
                loading={loading}
                size="block"
                name="submit"
                style={{ marginTop: 20, marginBottom: 10 }}
              >
                Speichern
              </Ui_Button>
            </Ui_Form>
          </>
        </Ui_Modal>
      </div>
    </div>
  )
}

export default HouseholdsPage
