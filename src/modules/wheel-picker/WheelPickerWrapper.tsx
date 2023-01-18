import { Ui_Button, Ui_FlexGrow } from '@vermorxt/pandora_ui'
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
  const { pickerOptions, setPickerOptions } = props
  const { open, data } = pickerOptions

  return (
    <>
      <div className={`${scss.wheel_wrapper} ${open ? scss.open : ''}`}>
        <div className={scss.selector}></div>

        <div className={scss.wheel_container}>
          {data?.map((d, i) => (
            <div key={i} style={{ width: `${100 / data?.length}%`, maxWidth: 160 }}>
              <WheelPicker4 key={i} data={d} index={i} open={open} />
            </div>
          ))}
        </div>
        <Ui_FlexGrow style={{ marginTop: 30, textAlign: 'center', display: 'flex', width: '100%' }}>
          <Ui_FlexGrow.Full>
            <Ui_Button size="small" onClick={() => setPickerOptions({ ...pickerOptions, open: false })}>
              Abruch
            </Ui_Button>
          </Ui_FlexGrow.Full>
          <Ui_FlexGrow.Full>
            <Ui_Button
              size="small"
              variant="primary"
              onClick={() => setPickerOptions({ ...pickerOptions, open: false })}
            >
              Speichern
            </Ui_Button>
          </Ui_FlexGrow.Full>
        </Ui_FlexGrow>
      </div>
    </>
  )
}

export default React.memo(WheelPickerWrapper)
