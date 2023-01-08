import { Ui_Button, Ui_FlexGrow, Ui_Hero } from '@vermorxt/pandora_ui'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { formIsValid, useSubmit } from '../../../../src/modules/form'
import { Ui_Form } from '../../../../src/modules/form/hooks/form-context'
import { InitialFormValues } from '../../../../src/modules/form/_types/form/initial-form-values'

const formInitialValues = [
  {
    name: 'small_fridge',
    value: '',
    label: 'Kleiner Kühlschrank',
    type: 'checkbox',
    quantity: 0,
    validation: {},
  },
  {
    name: 'fridge',
    value: '',
    label: 'Großer Kühlschrank',
    type: 'checkbox',
    quantity: 0,
    validation: {},
  },
  {
    name: 'fryer',
    value: '',
    label: 'Kühltruhe',
    type: 'checkbox',
    quantity: 0,
    validation: {},
  },
  {
    name: 'tv',
    value: '',
    label: 'Fernseher',
    type: 'checkbox',
    quantity: 0,
    validation: {},
  },
  {
    name: 'heater',
    value: '',
    label: 'Stromheizung',
    type: 'checkbox',
    quantity: 0,
    validation: {},
  },
  {
    name: 'pc',
    value: '',
    label: 'PC',
    type: 'checkbox',
    quantity: 0,
    validation: {},
  },
] as InitialFormValues[]

const DevicesPage = () => {
  const router = useRouter()

  const devices = ['Kühlschrank', 'Kühltruhe', 'Fernseher', 'Stromheizung', 'PC']

  const [formValues, setFormValues] = useState(formInitialValues)

  const handleSubmit = useSubmit((values, errors, touched) => {
    const checkForm = formIsValid(values, formInitialValues)

    if (checkForm.errors.length > 0 || errors?.length > 0) {
      console.log('form error found')
      return
    }

    console.log('form complete: ', values)

    void router.push('/dashboard/welcome/anamnese/')
  })

  const addFormValue = () => {
    formInitialValues.push({
      name: 'custom',
      value: '',
      label: '',
      type: 'text',
      quantity: 0,
      validation: {},
    })

    setFormValues([...formInitialValues])
  }

  return (
    <Ui_Hero style={{ minHeight: 'calc(100vh - 140px)' }} bgColor="base-100">
      <Ui_Hero.Content className="text-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold">
            Welche Geräte hast du?
            <br />
          </h1>
          <small>Du machst das gut!</small>
          <p className="py-4">Bitte wähle aus folgender Liste aus!</p>
          <p className="pb-4">
            Der Akku kann maximal 1000 Watt Strom einspeisen. Je genauer wir wissen welche Geräte du hast, um so
            effizienter ist die Abnahme.
          </p>

          <Ui_FlexGrow>
            <Ui_FlexGrow.Full></Ui_FlexGrow.Full>
            <Ui_FlexGrow.Static style={{ width: 80, textAlign: 'center', marginBottom: -3, opacity: 0.5 }}>
              <small>Anzahl</small>
            </Ui_FlexGrow.Static>
          </Ui_FlexGrow>
          <Ui_Form handleSubmit={handleSubmit} formInitialValues={formValues} id="devices">
            {/* <Ui_Button
              size="small"
              outline
              className={`btn-primary w-full mb-0`}
              type="button"
              name="submit"
              style={{ marginTop: 20, marginBottom: 10 }}
              onClick={() => addFormValue()}
            >
              + hinzufügen
            </Ui_Button> */}
            <Ui_Button
              size="block"
              className={`btn-secondary`}
              type="submit"
              name="submit"
              style={{ marginTop: 20, marginBottom: 10 }}
            >
              Weiter
            </Ui_Button>
          </Ui_Form>

          <Ui_FlexGrow>
            <Ui_FlexGrow.Static className="mr-2">
              <Ui_Button variant="ghost" size="full" onClick={() => void router.push('/dashboard/welcome/intro')}>
                {`<`}
              </Ui_Button>
            </Ui_FlexGrow.Static>
            <Ui_FlexGrow.Full>
              <Ui_Button variant="ghost" size="full" onClick={() => void router.push('/dashboard/')}>
                Schritt überspringen
              </Ui_Button>
            </Ui_FlexGrow.Full>
          </Ui_FlexGrow>
        </div>
      </Ui_Hero.Content>
    </Ui_Hero>
  )
}

export default DevicesPage
