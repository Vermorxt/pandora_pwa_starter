import React, { FC, InputHTMLAttributes, useEffect, useState } from 'react'
import Text from '../text'
import { formErrors } from '../util/form-is-valid'
import { getFieldError } from '../util/validation'
import { ValidationOptions } from '../_types/form/validation-options'
import scss from './../styles/toggle-password.module.scss'

export interface Ui_FormPropsInput extends InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: string
  name?: string
  label?: string
  altLabel?: string
  validation?: ValidationOptions
  formErrors?: formErrors
}

export const Input: FC<Ui_FormPropsInput> = React.memo((props: Ui_FormPropsInput) => {
  const { label, altLabel, name, placeholder, value, type, validation, formErrors } = props

  const [inputValue, setInputValue] = useState<string>(value as string)
  const [touched, setTouched] = useState(false)
  const [displayErrorMessage, setDisplayErrorMessage] = useState<any>()
  const [passwordHidden, setPasswordHidden] = useState(true)

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

  const togglePassword = () => {
    const toggled = !passwordHidden
    setPasswordHidden(toggled)
  }

  return (
    <>
      <div className={`${type === 'password' ? scss['toggle-wrapper'] : ''}`}>
        <label className="label">
          <span className="label-text">{label}</span>
          <span className="label-text-alt">{altLabel}</span>
        </label>

        <input
          className={`input input-primary w-full h-10 
        ${displayErrorMessage ? 'input-error' : ''}
        ${touched ? 'input-touched' : ''}
        `}
          key={name}
          name={name}
          type={passwordHidden ? type : 'text'}
          value={inputValue || ''}
          placeholder={placeholder}
          onChange={event => change(event.currentTarget.value)}
          onKeyUp={event => change(event.currentTarget.value)}
          onBlur={() => setTouched(true)}
        />
        {type === 'password' && (
          <button type="button" className={scss.toggle} onClick={() => togglePassword()}>
            {passwordHidden ? 'show' : 'hide'}
          </button>
        )}
      </div>

      {displayErrorMessage && (
        <Text type="error" data-cy-elem={name}>
          {displayErrorMessage}
        </Text>
      )}
    </>
  )
})
