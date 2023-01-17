import { Ui_Button } from '@vermorxt/pandora_ui'
import { useState } from 'react'
import WheelPicker3 from '../../src/modules/wheel-picker/WheelPicker3'
import WheelPickerWrapper, { PickerOptions } from '../../src/modules/wheel-picker/WheelPickerWrapper'

const testNumbers = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
]
const testStrings = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]

const Dashboard = () => {
  const [pickerOptions, setPickerOptions] = useState<PickerOptions>({
    open: false,
    data: [testNumbers, testStrings],
  })

  const handleChange = (value: any) => {
    console.log('handle change: ', value)
  }

  return (
    <>
      <h1 className="text-3xl font-bold">DASHBOARD</h1>
      <Ui_Button onClick={() => setPickerOptions({ ...pickerOptions, open: !pickerOptions.open })}>
        open picker
      </Ui_Button>

      <WheelPickerWrapper pickerOptions={pickerOptions} setPickerOptions={setPickerOptions} />
    </>
  )
}

export default Dashboard
