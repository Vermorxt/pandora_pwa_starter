import { Ui_Button, Ui_Modal, Ui_Stat } from '@vermorxt/pandora_ui'
import { Helper } from '@vermorxt/pandora_utils'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { formIsValid, useSubmit } from '../../../src/modules/form'
import { Ui_Form } from '../../../src/modules/form/hooks/form-context'
import { InitialFormValues } from '../../../src/modules/form/_types/form/initial-form-values'

export interface HouseHold {
  id?: string
  name?: string
  address?: string
  active?: boolean
}

const HouseholdsPage = () => {
  const [showError, setShowError] = useState(false)
  const [loginFailed, setLoginFailed] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [forceClose, setForceClose] = useState<boolean>()
  const [houseHold, setHouseHold] = useState<HouseHold[]>([])

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

      return
    }

    setLoading(false)
    console.log('add haushalt')

    const house = {
      name: values?.name,
      address: values?.address,
    }

    houseHold.push(house)
    setHouseHold([...houseHold])
    setForceClose(true)

    setTimeout(() => {
      setForceClose(undefined)
    }, 1000)
  })

  return (
    <div>
      <h1>Haushalte</h1>
      <div style={{ marginTop: 20, marginBottom: 40 }}>
        <div style={{ marginBottom: 40 }}>
          {houseHold.length <= 0 && (
            <p className="py-6">
              Jedes Balkonkraftwerk kann einem Haushalt zugeordnet werden. Bitte füge einen Haushalt hinzu!
            </p>
          )}
          {houseHold.length > 0 &&
            houseHold.map((house, index) => (
              <Ui_Stat key={index} style={{ width: '100%', marginBottom: 20 }}>
                <Ui_Stat.Item>
                  <Ui_Stat.Title>{house?.address}</Ui_Stat.Title>
                  <Ui_Stat.Value>{house?.name}</Ui_Stat.Value>
                  <Ui_Stat.Description>Ersttellt: {dayjs().format('DD.MM.YYYY HH:mm')} </Ui_Stat.Description>
                </Ui_Stat.Item>
                <Ui_Stat.Item className="flex justify-center items-center">
                  <Ui_Button size="small">Verwalten</Ui_Button>
                </Ui_Stat.Item>
              </Ui_Stat>
            ))}
        </div>

        <Ui_Modal
          closeClickOutside={false}
          forceClose={forceClose}
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
