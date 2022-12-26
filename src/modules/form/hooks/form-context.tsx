import React, { createContext, FC, FormEvent, ReactNode, useContext } from 'react'
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

export const Ui_FormContext = createContext({})

const Ui_Form = (props: Ui_FormProps) => {
  const { children, className, id, handleSubmit } = props

  return (
    <Ui_FormContext.Provider value={props}>
      <form
        noValidate
        className={`${className ? className : ''}`}
        onSubmit={handleSubmit}
        id={id ? id : `form_${Math.random()}`}
      >
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
