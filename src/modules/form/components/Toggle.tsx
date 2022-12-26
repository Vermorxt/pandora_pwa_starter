import { ValidationOptions } from '../_types/form/validation-options'
import React, { FC, InputHTMLAttributes, useEffect, useState } from 'react'
import Text from '../text'
import { formErrors } from '../util/form-is-valid'
import { getFieldError } from '../util/validation'

export interface Ui_FormPropsToggle extends InputHTMLAttributes<HTMLTextAreaElement> {
  defaultValue?: string
  name?: string
  label?: string
  altLabel?: string
  validation?: ValidationOptions
  formErrors?: formErrors
}

export const Toggle: FC<Ui_FormPropsToggle> = React.memo((props: Ui_FormPropsToggle) => {
  const { label, name, value, validation, formErrors } = props

  const [inputValue, setInputValue] = useState<boolean>(value as unknown as boolean)
  const [touched, setTouched] = useState(false)
  const [displayErrorMessage, setDisplayErrorMessage] = useState<any>()

  const change = (inputValue: boolean) => {
    setInputValue(!inputValue)
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
    const errorMessage = getFieldError(inputValue as unknown as string, validation as ValidationOptions, name)

    setDisplayErrorMessage(touched && errorMessage?.message)
  }, [inputValue])

  return (
    <>
      <label className={`label _label-checkbox cursor-pointer mt-4 ${displayErrorMessage ? 'error' : 'mb-4'}`}>
        <span className="label-text">{label}</span>
        <input
          key={name}
          name={name}
          type="checkbox"
          className="toggle toggle-primary"
          checked={inputValue as unknown as boolean}
          onChange={() => change(inputValue)}
        />
      </label>

      {displayErrorMessage && (
        <Text type="error" data-cy-elem={name}>
          {displayErrorMessage}
        </Text>
      )}
    </>
  )
})
