import { BleClient, BleDevice, numbersToDataView, numberToUUID, ScanResult } from '@capacitor-community/bluetooth-le'
import { Wifi } from '@capacitor-community/wifi'
import { Network } from '@capacitor/network'
import { Ui_Alert, Ui_Button, Ui_Stat } from '@vermorxt/pandora_ui'
import { useEffect, useState } from 'react'
import SweetAlertToast from '../../../src/components/SweetAlert/sweet-alert-toast'

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
  const [singleDevice, setSingleDevice] = useState<BleDevice & { battery?: number }>()
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

      console.log('Bluetooth initialized')
    } catch (error: any) {
      console.error(error)

      setBtError(error?.toString() as string)
    }
  }

  const disconnectDevice = async (deviceId: string) => {
    await BleClient.disconnect(deviceId)

    setSingleDevice(undefined)
    setDevices([])

    void SweetAlertToast({
      icon: 'info',
      text: `Device disconnected`,
      showConfirmButton: true,
    })

    await BleClient.stopLEScan()
  }

  const startDeviceListScan = async () => {
    // const selectedDevice = await BleClient.requestDevice()
    // console.log(0, ' --> selected device', selectedDevice)

    const requestedDevices = await BleClient.requestLEScan(
      {
        optionalServices: undefined,
      },
      devicesFound => {
        console.log('-----> devices found:', devicesFound)

        devices.push(devicesFound)

        setDevices([...devices])
      }
    ).catch(error => setBtError(`BT Error -> BleClient.requestLEScan: ${error?.toString() as string}`))

    console.log('-----> devices found:', requestedDevices)
  }

  const connectSingleDevice = async (selectedDevice: BleDevice) => {
    void SweetAlertToast({
      icon: 'info',
      text: `Connect single device: ${selectedDevice?.deviceId}`,
      showConfirmButton: true,
    })

    await BleClient.stopLEScan()
    // await BleClient.disconnect(selectedDevice.deviceId)

    void SweetAlertToast({
      icon: 'info',
      text: `Disconnected single`,
      showConfirmButton: true,
    })

    await BleClient.connect(selectedDevice.deviceId, deviceId => onDisconnect(deviceId)).catch(error =>
      setBtError(`BT Error -> BleClient.connect: ${error?.toString() as string}`)
    )
    console.log(2, ' --> connected device', selectedDevice)

    setSingleDevice(selectedDevice)

    void SweetAlertToast({
      icon: 'info',
      text: `Connected single succeed`,
      showConfirmButton: true,
    })

    const deviceServices = await BleClient.getServices(selectedDevice.deviceId).catch(error =>
      setBtError(`BT Error -> BleClient.getServices: ${error?.toString() as string}`)
    )

    console.log(3, ' --> services device', deviceServices)

    void SweetAlertToast({
      icon: 'info',
      text: `deviceServices get solved`,
      showConfirmButton: true,
    })

    if (!Array.isArray(deviceServices)) return

    void SweetAlertToast({
      icon: 'info',
      text: `deviceServices available`,
      showConfirmButton: true,
    })

    const serviceRead = await BleClient.read(
      selectedDevice.deviceId,
      deviceServices[0].uuid,
      deviceServices[0].characteristics[0].uuid || ''
    ).catch(
      error => null
      // setBtError(`BT Error -> BleClient.read: ${error?.toString() as string}`)
    )

    if (!serviceRead) return

    console.log(4, ' --> services read (battery level?)', serviceRead, serviceRead.getUint8(0))

    const battery = serviceRead.getUint8(0) || 0

    const dev = { ...singleDevice } as BleDevice & { battery: number }
    dev.battery = 0

    void SweetAlertToast({
      icon: 'info',
      text: `deviceServices read solved`,
      showConfirmButton: true,
    })

    setSingleDevice({ ...dev })
  }

  const startScan = async () => {
    try {
      const selectedDevice = await BleClient.requestDevice()
      console.log(0, ' --> selected device', selectedDevice)

      const requestedDevices = await BleClient.requestLEScan(
        {
          optionalServices: [],
          scanMode: 2,
        },
        devs => {
          console.log('-----> devices found:', devs)
        }
      )
      console.log(1, ' --> selected device', requestedDevices)

      await BleClient.disconnect(selectedDevice.deviceId)

      const connectedDevice = await BleClient.connect(selectedDevice.deviceId, deviceId => onDisconnect(deviceId))
      console.log(2, ' --> connected device', connectedDevice)

      const deviceServices = await BleClient.getServices(selectedDevice.deviceId)
      console.log(3, ' --> services device', deviceServices)

      const serviceRead = await BleClient.read(
        selectedDevice.deviceId,
        deviceServices[0].uuid,
        deviceServices[0].characteristics[0].uuid
      )
      console.log(4, ' --> services read (battery level?)', serviceRead, serviceRead.getUint8(0))

      // NOTE: only available on android
      // const btSettings = await BleClient.openBluetoothSettings()
      // console.log(5, ' --> btSettings device', btSettings)

      return

      const device = await BleClient.requestDevice({ optionalServices: ['162348d9-d5a8-4870-8086-8e152fd06a92'] })

      await BleClient.disconnect(device.deviceId)
      // connect to device, the onDisconnect callback is optional
      await BleClient.connect(device.deviceId, deviceId => onDisconnect(deviceId))

      await BleClient.getServices(device.deviceId).then(services => {
        console.log('services BT device', services)

        if (services[0]) {
          //....
        } else {
          //....
        }
      })

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
      <Ui_Button onClick={() => void startDeviceListScan()} size="block">
        Start scan
      </Ui_Button>
      <p>{scanStatus}</p>

      {singleDevice && (
        <Ui_Stat style={{ width: '100%', marginBottom: 20 }}>
          <Ui_Stat.Item>
            <Ui_Stat.Title className="_ellipsis">{singleDevice?.deviceId}</Ui_Stat.Title>
            <Ui_Stat.Value className="_ellipsis" style={{ fontSize: '1rem' }}>
              {singleDevice?.name || 'Kein Name'}
            </Ui_Stat.Value>
            <Ui_Stat.Description className="_ellipsis">Verbunden: Ja</Ui_Stat.Description>
          </Ui_Stat.Item>
          <Ui_Stat.Item className="flex justify-center items-center">
            <Ui_Button
              size="small"
              variant="ghost"
              outline
              onClick={() => void disconnectDevice(singleDevice.deviceId)}
            >
              Trennen
            </Ui_Button>
          </Ui_Stat.Item>
        </Ui_Stat>
      )}

      {!singleDevice &&
        devices.map((device, index) => (
          <Ui_Stat key={index} style={{ width: '100%', marginBottom: 20 }}>
            <Ui_Stat.Item>
              <Ui_Stat.Title className="_ellipsis">{device?.device?.deviceId}</Ui_Stat.Title>
              <Ui_Stat.Value className="_ellipsis" style={{ fontSize: '1rem' }}>
                {device?.device?.name || 'Kein Name'}
              </Ui_Stat.Value>
              <Ui_Stat.Description className="_ellipsis">Verbunden: Nein</Ui_Stat.Description>
            </Ui_Stat.Item>
            <Ui_Stat.Item className="flex justify-center items-center">
              <Ui_Button size="small" variant="ghost" outline onClick={() => void connectSingleDevice(device.device)}>
                Verbinden
              </Ui_Button>
            </Ui_Stat.Item>
          </Ui_Stat>
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
