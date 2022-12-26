import { ValidationOptions } from '../_types/form/validation-options'
import React, { FC, InputHTMLAttributes, useEffect, useState } from 'react'
import Text from '../text'
import { formErrors } from '../util/form-is-valid'
import { getFieldError } from '../util/validation'

export interface Ui_FormPropsTextArea extends InputHTMLAttributes<HTMLTextAreaElement> {
  defaultValue?: string
  name?: string
  label?: string
  altLabel?: string
  validation?: ValidationOptions
  formErrors?: formErrors
}

export const TextArea: FC<Ui_FormPropsTextArea> = React.memo((props: Ui_FormPropsTextArea) => {
  const { children, className, label, altLabel, name, placeholder, value, validation, formErrors } = props

  const [inputValue, setInputValue] = useState<string>(value as string)
  const [touched, setTouched] = useState(false)
  const [displayErrorMessage, setDisplayErrorMessage] = useState<any>()

  const change = (option: React.SetStateAction<string>) => {
    setInputValue(option)
    setTouched(true)
  }

  useEffect(() => {
    if (formErrors) {
      const error = formErrors?.find(e => Object.keys(e).includes(name as string))

      if (error) {
        setDisplayErrorMessage(error?.[name as string]?.message)
      }
    }
  }, [formErrors])

  useEffect(() => {
    const errorMessage = getFieldError(inputValue, validation as ValidationOptions, name)
    setDisplayErrorMessage(touched && errorMessage?.message)
  }, [inputValue])

  return (
    <>
      <label className="label">
        <span className="label-text">{label}</span>
        <span className="label-text-alt">{altLabel}</span>
      </label>
      <textarea
        className={`
        ${className ? className : ''} 
        ${displayErrorMessage ? 'error' : ''} 
        ${touched ? 'input-touched' : ''} 
        textarea textarea-primary textarea-bordered h-24 resize rounded-md`}
        key={name}
        name={name}
        value={inputValue || ''}
        placeholder={placeholder}
        onChange={event => change(event.currentTarget.value)}
        onBlur={() => setTouched(true)}
      >
        {children}
      </textarea>
      {displayErrorMessage && (
        <Text type="error" data-cy-elem={name}>
          {displayErrorMessage}
        </Text>
      )}
    </>
  )
})
