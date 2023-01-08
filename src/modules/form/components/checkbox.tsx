import { Ui_Button, Ui_FlexGrow } from '@vermorxt/pandora_ui'
import React, { FC, InputHTMLAttributes, useEffect, useState } from 'react'
import Text from '../text'
import { formErrors } from '../util/form-is-valid'
import { getFieldError } from '../util/validation'
import { ValidationOptions } from '../_types/form/validation-options'

export interface Ui_FormPropsToggle extends InputHTMLAttributes<HTMLTextAreaElement> {
  defaultValue?: string
  name?: string
  label?: string
  altLabel?: string
  quantity?: number
  validation?: ValidationOptions
  formErrors?: formErrors
}

export const Checkbox: FC<Ui_FormPropsToggle> = React.memo((props: Ui_FormPropsToggle) => {
  const { label, name, value, quantity, validation, formErrors } = props

  const [inputValue, setInputValue] = useState<boolean>(value as unknown as boolean)
  const [countValue, setCountValue] = useState<number>(quantity?.toString() ? quantity : 0)
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

    if (inputValue === false) {
      setCountValue(0)
    }

    if (inputValue === true) {
      if (!countValue) {
        setCountValue(1)
      }
    }
  }, [inputValue])

  const CheckBox = () => {
    console.log('quantity checkbox')

    return (
      <label className={`label _label-checkbox cursor-pointer ${displayErrorMessage ? 'error' : ''}`}>
        <span className="label-text">{label}</span>
        <span style={{ flexGrow: 1 }}></span>

        <input
          key={name}
          name={name}
          type="checkbox"
          className={`
          checkbox checkbox-primary 
          ${touched ? 'input-touched' : ''}
          `}
          checked={inputValue as unknown as boolean}
          onChange={() => change(inputValue)}
        />
      </label>
    )
  }

  const countController = (direction?: 'up' | 'down') => {
    let count = countValue

    if (direction === 'up') {
      if (countValue?.toString() && countValue < 99) {
        count = countValue + 1
        setCountValue(count)
      }
    }
    if (direction === 'down') {
      if (countValue?.toString() && countValue > 0) {
        count = countValue - 1
        setCountValue(count)
      }
    }

    if (count === 0) {
      setInputValue(false)
    }

    if (count > 0) {
      setInputValue(!inputValue ? true : inputValue)
    }
  }

  const CheckBoxQuantity = () => {
    console.log('quantity checkbox')

    return (
      <Ui_FlexGrow>
        <Ui_FlexGrow.Full>
          <label className={`label _label-checkbox cursor-pointer ${displayErrorMessage ? 'error' : ''}`}>
            <span className="label-text">{label}</span>
            <span style={{ flexGrow: 1 }}></span>

            <input
              key={name}
              name={name}
              type="checkbox"
              className={`checkbox checkbox-primary 
                ${touched ? 'input-touched' : ''}
              `}
              checked={inputValue as unknown as boolean}
              onChange={() => change(inputValue)}
            />
          </label>
        </Ui_FlexGrow.Full>
        <Ui_FlexGrow.Static style={{ width: 80, padding: '0.5rem 0 0 0.5rem' }}>
          <div className="flex">
            <Ui_Button size="mini" onClick={() => countController('down')}>
              -
            </Ui_Button>
            <input
              name={`${name as string}_quantity`}
              style={{ width: 20, textAlign: 'center' }}
              value={countValue}
              readOnly
            />
            <Ui_Button size="mini" onClick={() => countController('up')}>
              +
            </Ui_Button>
          </div>
        </Ui_FlexGrow.Static>
      </Ui_FlexGrow>
    )
  }

  return (
    <>
      {!quantity?.toString() && <CheckBox />}
      {quantity?.toString() && <CheckBoxQuantity />}

      {displayErrorMessage && (
        <Text type="error" data-cy-elem={name}>
          {displayErrorMessage}
        </Text>
      )}
    </>
  )
})
