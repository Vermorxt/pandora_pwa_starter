import { ValidationOptions } from '../_types/form/validation-options'
import React, { FC, InputHTMLAttributes, useEffect, useState } from 'react'
import Text from '../text'
import { formErrors } from '../util/form-is-valid'
import { getFieldError } from '../util/validation'

export interface Ui_FormPropsRange extends InputHTMLAttributes<HTMLInputElement> {
  defaultValue?: string
  name?: string
  label?: string
  altLabel?: string
  validation?: ValidationOptions
  formErrors?: formErrors
}

interface Ui_Range_colors {
  primary?: boolean
  secondary?: boolean
  accent?: boolean
}

export const Range: FC<Ui_FormPropsRange> = React.memo((props: Ui_FormPropsRange) => {
  const { label, altLabel, step, min, max, name, placeholder, value, type, validation, formErrors, ...rest } = props

  const colorTypes = ['primary', 'secondary', 'accent']
  const colorType = colorTypes
    .map(color => (Object.keys(rest).includes(color) ? color : null))
    .filter(c => c) as string[]

  const [inputValue, setInputValue] = useState(value)
  const [touched, setTouched] = useState(false)
  const [displayErrorMessage, setDisplayErrorMessage] = useState<any>()

  const change = (option: React.SetStateAction<string>) => {
    setInputValue(Number(option))
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
    const errorMessage = getFieldError(inputValue as number, validation as ValidationOptions, name)

    if (errorMessage?.message) {
      setDisplayErrorMessage(touched && errorMessage?.message)
    } else {
      setDisplayErrorMessage(null)
    }
  }, [inputValue])

  return (
    <>
      <label className="label">
        <span className="label-text">{label}</span>
        <span className="label-text-alt">{altLabel}</span>
      </label>
      <div className={`_range-wrapper ${displayErrorMessage ? 'error' : ''}`}>
        <input
          className={`range range-primary w-full 
        ${displayErrorMessage ? 'input-error' : ''}
        ${touched ? 'input-touched' : ''} 
        ${colorType.length ? `range-${colorType[0]}` : ''}${' '}
        `}
          key={name}
          name={name}
          type={type}
          min={min}
          max={max}
          step={step}
          value={inputValue || 0}
          placeholder={placeholder}
          onChange={event => change(event.currentTarget.value)}
          onBlur={() => setTouched(true)}
        ></input>
        {step && (
          <div className="w-full flex justify-between text-xs px-2">
            {Array.from(Array(100 / Number(step) + 1)).map((a, i) => (
              <span key={i}>|</span>
            ))}
          </div>
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
