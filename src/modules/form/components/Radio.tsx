import React, { FC, InputHTMLAttributes, useEffect, useState } from 'react'
import Text from '../text'
import { formErrors } from '../util/form-is-valid'
import { getFieldError } from '../util/validation'
import { ValidationOptions } from '../_types/form/validation-options'

export interface Ui_FormPropsRadio extends InputHTMLAttributes<HTMLTextAreaElement> {
  defaultValue?: string
  name?: string
  label?: string
  altLabel?: string
  radioOptions?: string[]
  validation?: ValidationOptions
  formErrors?: formErrors
}

export const Radio: FC<Ui_FormPropsRadio> = React.memo((props: Ui_FormPropsRadio) => {
  const { name, value, validation, radioOptions, formErrors } = props

  const [inputValue, setInputValue] = useState<string>(value as unknown as string)
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
      <div className={`_radio-wrapper ${displayErrorMessage ? 'error' : ''}`}>
        {radioOptions?.map((option, index) => (
          <div className="form-control" key={index}>
            <label className="label cursor-pointer">
              <span className="label-text">{option}</span>
              <input
                type="radio"
                name={name}
                value={inputValue}
                className={`
                  radio checked:bg-primary         
                  ${touched ? 'input-touched' : ''}
                `}
                checked={inputValue === option}
                onChange={() => change(option)}
              />
            </label>
          </div>
        ))}
      </div>{' '}
      {displayErrorMessage && (
        <Text type="error" data-cy-elem={name}>
          {displayErrorMessage}
        </Text>
      )}
    </>
  )
})
