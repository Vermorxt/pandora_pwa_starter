import { Ui_Button, Ui_FlexGrow, Ui_Hero, Ui_InputGroup } from '@vermorxt/pandora_ui'
import { useRouter } from 'next/router'
import { useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export const datePickerCustomOptions = {
  dateFormat: 'HH:mm',
  // dateFormat: 'dd.M.yyyy HH:mm',
  timeIntervals: 15,
  timeFormat: 'HH:mm',
}

const AnamnesePage = () => {
  const router = useRouter()

  const [formDate, setFormDate] = useState<Date>(new Date())

  const changeDate = (date: Date) => {
    console.log('changed date: ', date)

    setFormDate(date)
  }

  return (
    <Ui_Hero style={{ minHeight: 'calc(100vh - 140px)' }} bgColor="base-100">
      <Ui_Hero.Content className="text-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold">
            Wann bist du aktiv?
            <br />
          </h1>
          <small>Du machst das gut!</small>
          <p className="py-4">Bitte wähle folgende Profile aus!</p>
          <p className="py-4">
            Wenn du zu Hause bist, werden voraussichtlich mehr Verbraucher aktiv sein. Wir werden die Einstellungen
            dahingehend optimieren und für die bestmögliche Effizienz sorgen.
          </p>

          <p>Wann stehst du auf?</p>
          <div className="form-control">
            <Ui_InputGroup size="small">
              <span>Uhrzeit</span>
              <div className="w-full">
                <ReactDatePicker
                  selected={formDate}
                  dateFormat={datePickerCustomOptions.dateFormat}
                  timeIntervals={datePickerCustomOptions.timeIntervals}
                  timeFormat={datePickerCustomOptions.timeFormat}
                  showTimeSelect
                  onChange={date => changeDate(date as Date)}
                  withPortal
                  showTimeSelectOnly
                  timeCaption="Zeit"
                />
              </div>
            </Ui_InputGroup>
          </div>
          <p className="mt-4">Wann verlässt du das Haus?</p>
          <div className="form-control">
            <Ui_InputGroup size="small">
              <span>Uhrzeit</span>
              <div className="w-full">
                <ReactDatePicker
                  selected={formDate}
                  dateFormat={datePickerCustomOptions.dateFormat}
                  timeIntervals={datePickerCustomOptions.timeIntervals}
                  timeFormat={datePickerCustomOptions.timeFormat}
                  showTimeSelect
                  onChange={date => changeDate(date as Date)}
                  withPortal
                  showTimeSelectOnly
                  timeCaption="Zeit"
                />
              </div>
            </Ui_InputGroup>
          </div>

          <Ui_FlexGrow className="mb-4 mt-8">
            <Ui_FlexGrow.Static className="mr-2">
              <Ui_Button variant="neutral" size="full" onClick={() => void router.push('/dashboard/welcome/devices')}>
                {`<`}
              </Ui_Button>
            </Ui_FlexGrow.Static>
            <Ui_FlexGrow.Full>
              <Ui_Button variant="secondary" size="full" onClick={() => void router.push('/dashboard/households')}>
                Profil speichern
              </Ui_Button>
            </Ui_FlexGrow.Full>
          </Ui_FlexGrow>
        </div>
      </Ui_Hero.Content>
    </Ui_Hero>
  )
}

export default AnamnesePage
