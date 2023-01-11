import { BatteryInfo, Device, DeviceId, DeviceInfo, GetLanguageCodeResult, LanguageTag } from '@capacitor/device'
import { Ui_Button } from '@vermorxt/pandora_ui'
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings'
import { useEffect, useState } from 'react'

const SettingsPage = () => {
  const [id, setId] = useState<DeviceId>()
  const [languageCode, setLanguageCode] = useState<GetLanguageCodeResult>()
  const [languageTag, setLanguageTag] = useState<LanguageTag>()
  const [device, setDevice] = useState<DeviceInfo>()
  const [battery, setBattery] = useState<BatteryInfo>()

  const logDeviceInfo = async () => {
    const info = await Device.getInfo()

    setDevice(info)

    console.log('device info: ', info)

    if (!['android', 'ios'].includes(info.operatingSystem)) {
      return
    }

    await logBatteryInfo()
    await logDeviceId()
    await logDeviceId()
    await logLanguageCode()
    await logLanguageTag()
  }

  useEffect(() => {
    void logDeviceInfo()
  }, [])

  const logBatteryInfo = async () => {
    const info = await Device?.getBatteryInfo()

    console.log('battery: ', info)

    setBattery(info)
  }

  const logDeviceId = async () => {
    const info = await Device.getId()

    console.log('id: ', info)

    setId(info)
  }

  const logLanguageCode = async () => {
    const info = await Device.getLanguageCode()

    console.log('language code: ', info)

    setLanguageCode(info)
  }

  const logLanguageTag = async () => {
    const info = await Device.getLanguageTag()

    console.log('language tag: ', info)

    setLanguageTag(info)
  }

  const openSettings = async () => {
    /**
     * Note that the only supported option by Apple is "App".
     * Using other options might break in future iOS versions
     * or have your app rejected from the App Store.
     */
    await NativeSettings.open({
      optionAndroid: AndroidSettings.ApplicationDetails,
      optionIOS: IOSSettings.General,
    })
  }

  const openNetwork = async () => {
    await NativeSettings.open({
      optionAndroid: AndroidSettings.Wifi,
      optionIOS: IOSSettings.WiFi,
    })
  }

  const openBluetooth = async () => {
    await NativeSettings.open({
      optionAndroid: AndroidSettings.Bluetooth,
      optionIOS: IOSSettings.Bluetooth,
    })
  }

  return (
    <>
      <h1 className="text-3xl mb-2">Einstellungen</h1>

      <h4 className="text-2xl mb-2">Device ID</h4>
      <table style={{ width: '100%', marginBottom: 20, textAlign: 'left' }}>
        <thead>
          <tr>
            <th style={{ width: 150 }}>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {id &&
            Object.entries(id).map((entry, index) => (
              <tr key={index}>
                <td>{entry?.[0]}</td>
                <td>{`${entry?.[1] as string}`}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <h4 className="text-2xl mb-2">Language Code</h4>
      <table style={{ width: '100%', marginBottom: 20, textAlign: 'left' }}>
        <thead>
          <tr>
            <th style={{ width: 150 }}>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {languageCode &&
            Object.entries(languageCode).map((entry, index) => (
              <tr key={index}>
                <td>{entry?.[0]}</td>
                <td>{`${entry?.[1] as string}`}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <h4 className="text-2xl mb-2">Language Tag</h4>
      <table style={{ width: '100%', marginBottom: 20, textAlign: 'left' }}>
        <thead>
          <tr>
            <th style={{ width: 150 }}>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {languageTag &&
            Object.entries(languageTag).map((entry, index) => (
              <tr key={index}>
                <td>{entry?.[0]}</td>
                <td>{`${entry?.[1] as string}`}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <h4 className="text-2xl mb-2">Battery</h4>
      <table style={{ width: '100%', marginBottom: 20, textAlign: 'left' }}>
        <thead>
          <tr>
            <th style={{ width: 150 }}>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {battery &&
            Object.entries(battery).map((entry, index) => (
              <tr key={index}>
                <td>{entry?.[0]}</td>
                <td>{`${entry?.[1] as string}`}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <h4 className="text-2xl mb-2">Device</h4>
      <table style={{ width: '100%', marginBottom: 20, textAlign: 'left' }}>
        <thead>
          <tr>
            <th style={{ width: 150 }}>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {device &&
            Object.entries(device).map((entry, index) => (
              <tr key={index}>
                <td>{entry?.[0]}</td>
                <td>{`${entry?.[1] as string}`}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {device && ['android', 'ios'].includes(device.operatingSystem) === true && (
        <>
          <h4 className="text-2xl mb-2">Action</h4>
          <Ui_Button
            variant="secondary"
            size="full"
            onClick={() => void openSettings()}
            className="mt-4"
            outline={true}
          >
            Open App settings
          </Ui_Button>
          <Ui_Button variant="secondary" size="full" onClick={() => void openNetwork()} className="mt-4" outline={true}>
            Open Network
          </Ui_Button>
          <Ui_Button
            variant="secondary"
            size="full"
            onClick={() => void openBluetooth()}
            className="mt-4"
            outline={true}
          >
            Open Bluetooth
          </Ui_Button>
        </>
      )}
    </>
  )
}

export default SettingsPage
