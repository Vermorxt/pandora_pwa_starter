import React, { Dispatch, FC, SetStateAction } from 'react'
import { setTimeout } from 'timers'
import scss from './styles/wheel-wrapper.module.scss'
import WheelPicker4 from './WheelPicker4'

export interface PickerOptions {
  data: any[]
  open?: boolean
  index?: number
}

export interface WheelPickerWrapperProps {
  pickerOptions: PickerOptions
  setPickerOptions: Dispatch<SetStateAction<PickerOptions>>
}

const WheelPickerWrapper: FC<WheelPickerWrapperProps> = (props: WheelPickerWrapperProps) => {
  const { pickerOptions } = props
  const { open, data } = pickerOptions

  return (
    <>
      <div className={`${scss.wheel_wrapper} ${open ? scss.open : ''}`}>
        <div className={scss.selector}></div>

        <div className={scss.wheel_container}>
          {data?.map((d, i) => (
            <div key={i} style={{ width: `${100 / data?.length}%` }}>
              <WheelPicker4 key={i} data={d} index={i} open={open} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default React.memo(WheelPickerWrapper)
