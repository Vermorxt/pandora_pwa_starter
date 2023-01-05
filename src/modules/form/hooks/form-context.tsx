import React, { createContext, FC, FormEvent, ReactNode, useContext, useState } from 'react'
import {
  Checkbox,
  Field,
  Input,
  Radio,
  Range,
  Select,
  TextArea,
  Toggle,
  Ui_FormPropsInput,
  Ui_FormPropsTextArea,
  Ui_FormPropsToggle,
} from '../components'
import { FormElementGenerator } from '../components/form-element-generator'
import { formIsValid } from '../util/form-is-valid'
import { InitialFormValues } from '../_types/form/initial-form-values'

export interface Ui_FormProps {
  children?: ReactNode
  className?: string
  id?: string
  formInitialValues?: InitialFormValues[]
  handleSubmit?: (event: FormEvent<HTMLFormElement>) => void | null
}

export interface Ui_FormElementProps {
  Field: FC<Ui_FormProps>
  Input: FC<Ui_FormPropsInput>
  TextArea: FC<Ui_FormPropsTextArea>
  Toggle: FC<Ui_FormPropsToggle>
}

export const Ui_FormContext = createContext({ forceTouch: false })

const Ui_Form = (props: Ui_FormProps) => {
  const { formInitialValues, children, className, id, handleSubmit } = props

  const [forceTouch, setForceTouch] = useState(false)

  const handleSubmitProxy = (event: FormEvent<HTMLFormElement>) => {
    const eventTarget = event?.target as HTMLFormElement
    const formData = new FormData(eventTarget)
    const values = Object.fromEntries(formData)

    if (!props?.formInitialValues) {
      console.log(
        '!!! NO initial props provided. please add formInitialValues to form attributes to handle initial error management.'
      )

      return handleSubmit ? handleSubmit(event) : null
    }

    const checkForm = formIsValid(values, formInitialValues as InitialFormValues[])

    console.log('form is valid: ', checkForm)

    if (checkForm?.isValid === false) {
      setForceTouch(true)
    }

    return handleSubmit ? handleSubmit(event) : null
  }

  const shareProps = { ...props, forceTouch }

  return (
    <Ui_FormContext.Provider value={shareProps}>
      <form
        noValidate
        className={`${className ? className : ''}`}
        onSubmit={event => handleSubmitProxy(event)}
        id={id ? id : `form_${Math.random()}`}
      >
        {formInitialValues?.map((initials, i) => (
          <Ui_Form.Field key={i}>
            <Ui_Form.Element {...{ initials }} />
          </Ui_Form.Field>
        ))}
        {children}
      </form>
    </Ui_FormContext.Provider>
  )
}

const useFormContext = () => useContext(Ui_FormContext)

Ui_Form.Field = Field
Ui_Form.Input = Input
Ui_Form.TextArea = TextArea
Ui_Form.Toggle = Toggle
Ui_Form.Checkbox = Checkbox
Ui_Form.Radio = Radio
Ui_Form.Select = Select
Ui_Form.Range = Range
Ui_Form.Element = FormElementGenerator

export { Ui_Form, useFormContext }
