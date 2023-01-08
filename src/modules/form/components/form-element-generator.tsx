import React, { FC, InputHTMLAttributes } from 'react'
import { Ui_Form } from '../hooks/form-context'
import { formErrors } from '../util/form-is-valid'

const INPUT_TYPES = ['text', 'email', 'password', 'number', 'phone']
const TEXT_AREA_TYPES = ['textarea']
const TOGGLE_TYPES = ['toggle']
const CHECKBOX_TYPES = ['checkbox']
const RADIO_TYPES = ['radio']
const SELECT_TYPES = ['select']
const RANGE_TYPES = ['range']

interface Ui_FormElementGeneratorProps extends InputHTMLAttributes<HTMLFormElement> {
  initials: { type: string; label?: string }
  formErrors?: formErrors
}

export const FormElementGenerator: FC<Ui_FormElementGeneratorProps> = (props: Ui_FormElementGeneratorProps) => {
  const { initials, formErrors } = props

  console.log('initial types: ', RADIO_TYPES.includes(initials.type), initials)

  return (
    <>
      {INPUT_TYPES.includes(initials?.type) && (
        <Ui_Form.Input {...initials} formErrors={formErrors} placeholder={initials?.label} />
      )}

      {TEXT_AREA_TYPES.includes(initials.type) && (
        <Ui_Form.TextArea {...initials} formErrors={formErrors} placeholder={initials.label} />
      )}

      {TOGGLE_TYPES.includes(initials.type) && <Ui_Form.Toggle {...initials} formErrors={formErrors} />}

      {CHECKBOX_TYPES.includes(initials.type) && <Ui_Form.Checkbox {...initials} formErrors={formErrors} />}

      {RADIO_TYPES.includes(initials.type) && <Ui_Form.Radio {...initials} formErrors={formErrors} />}

      {SELECT_TYPES.includes(initials.type) && <Ui_Form.Select {...initials} formErrors={formErrors} />}

      {RANGE_TYPES.includes(initials.type) && <Ui_Form.Range {...initials} formErrors={formErrors} />}
    </>
  )
}
