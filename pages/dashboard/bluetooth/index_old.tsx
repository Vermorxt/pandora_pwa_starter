import { BleClient, numbersToDataView, numberToUUID, ScanResult } from '@capacitor-community/bluetooth-le'
import { Ui_Alert, Ui_Button } from '@vermorxt/pandora_ui'
import { BlockList } from 'net'
import { useEffect, useState } from 'react'
import { AnyType } from '../../../src/_types/anytype'

const HEART_RATE_SERVICE = '0000180d-0000-1000-8000-00805f9b34fb'

const Bluetooth = () => {
  const [btError, setBtError] = useState<string>()
  const [scanStatus, setScanStatus] = useState<string>()
  const [devices, setDevices] = useState<ScanResult[]>([])

  const initBluetooth = async () => {
    try {
      await BleClient.initialize({ androidNeverForLocation: true })
    } catch (e) {
      const err = e as AnyType

      setBtError(err.toString() as string)
    }
  }

  const startScan = async () => {
    const state = await BleClient.isEnabled()

    setScanStatus(`Starte scan ... ${state as unknown as string}`)

    await BleClient.requestLEScan({}, result => {
      console.log('received new scan result', result)
      setScanStatus('Devices found ...')
      setDevices([...devices, result])
    }).catch(error => {
      setScanStatus('Someting went wrong ...')
      console.log('error connection')
    })

    // await BleClient.requestLEScan(
    //   {
    //     allowDuplicates: false,
    //     scanMode: 1,
    //   },
    //   result => {
    //     console.log('received new scan result', result)

    //     setScanStatus('Devices found ...')

    //     devices.push(result)

    //     setDevices([...devices])
    //   }
    // )

    navigator.bluetooth.addEventListener('advertisementreceived', event => {
      setScanStatus('Devices found event ...')

      console.log('Advertisement received.')
      console.log('  Device Name: ', event.device.name)
      console.log('  Device ID: ', event.device.id)
      console.log('  RSSI: ', event.rssi)
      console.log('  TX Power: ', event.txPower)
      console.log('  UUIDs: ', event.uuids)
      event.manufacturerData.forEach((valueDataView, key) => {
        console.log('Manufacturer', key, valueDataView)
      })
      event.serviceData.forEach((valueDataView, key) => {
        console.log('Service', key, valueDataView)
      })

      devices.push(event.device as unknown as ScanResult)
      setDevices([...devices])
    })

    setTimeout(() => {
      void BleClient.stopLEScan()
      setScanStatus('Stopped scan ...')

      console.log('stopped scanning')
    }, 35000)
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
    </>
  )
}

export default Bluetooth
