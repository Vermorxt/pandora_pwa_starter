import { BleClient, numbersToDataView, numberToUUID, ScanResult } from '@capacitor-community/bluetooth-le'
import { Wifi } from '@capacitor-community/wifi'
import { Network } from '@capacitor/network'
import { Ui_Alert, Ui_Button } from '@vermorxt/pandora_ui'
import { useEffect, useState } from 'react'

const HEART_RATE_SERVICE = '0000180d-0000-1000-8000-00805f9b34fb'
const HEART_RATE_MEASUREMENT_CHARACTERISTIC = '00002a37-0000-1000-8000-00805f9b34fb'
const BODY_SENSOR_LOCATION_CHARACTERISTIC = '00002a38-0000-1000-8000-00805f9b34fb'
const BATTERY_SERVICE = numberToUUID(0x180f)
const BATTERY_CHARACTERISTIC = numberToUUID(0x2a19)
const POLAR_PMD_SERVICE = 'fb005c80-02e7-f387-1cad-8acd2d8df0c8'
const POLAR_PMD_CONTROL_POINT = 'fb005c81-02e7-f387-1cad-8acd2d8df0c8'

const Bluetooth = () => {
  const [btError, setBtError] = useState<string>()
  const [scanStatus, setScanStatus] = useState<string>()
  const [devices, setDevices] = useState<ScanResult[]>([])
  const [wifi, setWifi] = useState<any>()
  const [wifi2, setWifi2] = useState<any>({ ssid: 'nope', ip: '0.0.0.0' })

  const logCurrentNetworkStatus = async () => {
    const status = await Network.getStatus()

    const ssid = await Wifi.getSSID()
    const ip = await Wifi.getIP()

    console.log('Network status:', status)

    const newWifi = {
      ssid: ssid?.ssid,
      ip: ip?.ip,
    }

    setWifi(status)
    setWifi2({ ...newWifi })
  }

  const initBluetooth = async () => {
    try {
      void logCurrentNetworkStatus()

      await BleClient.initialize()
    } catch (error) {
      console.error(error)
    }
  }

  const startScan = async () => {
    // const state = await BleClient.isEnabled()

    // setScanStatus(`Starte scan ... ${state as unknown as string}`)

    // await BleClient.requestLEScan({}, result => {
    //   console.log('received new scan result', result)
    //   setScanStatus('Devices found ...')
    //   setDevices([...devices, result])
    // }).catch(error => {
    //   setScanStatus('Someting went wrong ...')
    //   console.log('error connection')
    // })

    try {
      const device = await BleClient.requestDevice({
        // services: [HEART_RATE_SERVICE],
        // optionalServices: [BATTERY_SERVICE, POLAR_PMD_SERVICE],
      })

      // connect to device, the onDisconnect callback is optional
      await BleClient.connect(device.deviceId, deviceId => onDisconnect(deviceId))
      console.log('connected to device', device)

      const result = await BleClient.read(device.deviceId, HEART_RATE_SERVICE, BODY_SENSOR_LOCATION_CHARACTERISTIC)
      console.log('body sensor location', result.getUint8(0))

      const battery = await BleClient.read(device.deviceId, BATTERY_SERVICE, BATTERY_CHARACTERISTIC)
      console.log('battery level', battery.getUint8(0))

      await BleClient.write(device.deviceId, POLAR_PMD_SERVICE, POLAR_PMD_CONTROL_POINT, numbersToDataView([1, 0]))
      console.log('written [1, 0] to control point')

      await BleClient.startNotifications(
        device.deviceId,
        HEART_RATE_SERVICE,
        HEART_RATE_MEASUREMENT_CHARACTERISTIC,
        value => {
          console.log('current heart rate', parseHeartRate(value))
        }
      )

      // disconnect after 10 sec
      setTimeout(() => {
        void BleClient.stopNotifications(device.deviceId, HEART_RATE_SERVICE, HEART_RATE_MEASUREMENT_CHARACTERISTIC)
        void BleClient.disconnect(device.deviceId)
        console.log('disconnected from device', device)
      }, 10000)
    } catch (error) {
      console.error(error)
    }
  }

  function onDisconnect(deviceId: string): void {
    console.log(`device ${deviceId} disconnected`)
  }

  function parseHeartRate(value: DataView): number {
    const flags = value.getUint8(0)
    const rate16Bits = flags & 0x1
    let heartRate: number
    if (rate16Bits > 0) {
      heartRate = value.getUint16(1, true)
    } else {
      heartRate = value.getUint8(1)
    }
    return heartRate
  }

  useEffect(() => {
    void initBluetooth()
  }, [])

  if (btError) {
    return (
      <>
        <h1>BLUETOOTH</h1>
        <Ui_Alert variant="error" style={{ marginTop: 20 }}>
          {btError}
        </Ui_Alert>
      </>
    )
  }

  return (
    <>
      <h1>BLUETOOTH</h1>
      <Ui_Button onClick={() => void startScan()}>Start scan</Ui_Button>
      <p>{scanStatus}</p>
      {devices.map(device => (
        <>
          <>{device.toString()}</>
          <p>------</p>
        </>
      ))}

      <>
        wifi connected: {`${wifi?.connected as string}`}
        <br />
      </>
      <>wifi connectionType: {wifi?.connectionType}</>
      <p>------</p>

      <>wifi 2 ssid: {`${wifi2?.ssid as string}`}</>
      <br />
      <>wifi 2 ip: {`${wifi2?.ip as string}`}</>
      <p>------</p>
      <Ui_Button variant="primary" onClick={() => void Wifi.disconnect()}>
        Disconnect
      </Ui_Button>
      <br />
      <Ui_Button
        variant="secondary"
        onClick={() => void Wifi.connect({ ssid: wifi2?.ssid, password: 'plasticpony97mnbvcxya' })}
      >
        Connect
      </Ui_Button>
    </>
  )
}

export default Bluetooth
