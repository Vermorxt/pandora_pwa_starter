import React, { FC, InputHTMLAttributes, useEffect, useState } from 'react'
import Text from '../text'
import { formErrors } from '../util/form-is-valid'
import { getFieldError } from '../util/validation'
import { ValidationOptions } from '../_types/form/validation-options'

export interface Ui_FormPropsSelect extends InputHTMLAttributes<HTMLTextAreaElement> {
  defaultValue?: string
  name?: string
  label?: string
  altLabel?: string
  validation?: ValidationOptions
  selectOptions?: string[]
  disableOptions?: string[]
  formErrors?: formErrors
}

export const Select: FC<Ui_FormPropsSelect> = React.memo((props: Ui_FormPropsSelect) => {
  const { label, name, value, validation, selectOptions, disableOptions, formErrors } = props

  const [inputValue, setInputValue] = useState<string>(value as unknown as string)
  const [touched, setTouched] = useState(false)
  const [displayErrorMessage, setDisplayErrorMessage] = useState<any>()

  const change = (e: { target: { value: React.SetStateAction<string> } }) => {
    setInputValue(e?.target?.value)
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
      </label>
      <select
        value={inputValue}
        name={name}
        placeholder={'test'}
        className={`
        select input-primary w-full font-normal
        ${displayErrorMessage ? 'input-error' : ''}       
        ${touched ? 'input-touched' : ''}
        `}
        onChange={e => change(e)}
      >
        {!inputValue && (
          <option value="" disabled>
            Select {label}
          </option>
        )}

        {selectOptions?.map((option, index) => (
          <option key={index} disabled={disableOptions?.includes(option)}>
            {option}
          </option>
        ))}
      </select>

      {displayErrorMessage && (
        <Text type="error" data-cy-elem={name}>
          {displayErrorMessage}
        </Text>
      )}
    </>
  )
})
