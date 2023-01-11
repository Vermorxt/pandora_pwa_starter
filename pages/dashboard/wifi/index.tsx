import { Wifi } from '@capacitor-community/wifi'
import { Geolocation, PermissionStatus, Position } from '@capacitor/geolocation'
import { ConnectionStatus, Network } from '@capacitor/network'
import { Ui_Alert, Ui_Button } from '@vermorxt/pandora_ui'
import { useEffect, useState } from 'react'
import SweetAlertToast from '../../../src/components/SweetAlert/sweet-alert-toast'

const WifiPage = () => {
  const [wifi2, setWifi2] = useState<any>({ ssid: 'nope', ip: '0.0.0.0' })
  const [wifiError, setWifiError] = useState<string>()
  const [location, setLocation] = useState<Position>()
  const [locationPermission, setLocationPermission] = useState<PermissionStatus>()

  const printCurrentPosition = async () => {
    const permission = await Geolocation.checkPermissions()
    const permissionRequest = await Geolocation.requestPermissions().catch((error: any) => {
      setWifiError(`Request permission: ${error?.toString() as string}`)
    })

    setLocationPermission(permission)

    const coordinates = await Geolocation.getCurrentPosition().catch((error: any) => {
      setWifiError(`Coordinates: ${error?.toString() as string}`)
    })

    if (!coordinates?.coords) {
      setWifiError('Something went wrong while check location')
      return
    }

    console.log('Current position:', coordinates)

    setLocation(coordinates)
  }

  const logCurrentNetworkStatus = async (status: ConnectionStatus) => {
    const ssid = await Wifi.getSSID().catch((error: any) => {
      setWifiError(`getSSID(): ${error?.toString() as string}`)
    })

    const ip = await Wifi.getIP().catch((error: any) => {
      setWifiError(`getIP(): ${error?.toString() as string}`)
    })

    console.log('Network status:', status)

    void SweetAlertToast({
      icon: 'info',
      text: `Wifi discovered`,
      showConfirmButton: true,
    })

    const newWifi = {
      ssid: ssid?.ssid,
      ip: ip?.ip,
      status,
    }

    setWifi2({ ...newWifi })
  }

  const initWifi = async () => {
    const status = await Network.getStatus()

    if (status.connectionType === 'wifi') {
      void SweetAlertToast({
        icon: 'info',
        text: `Wifi available`,
        showConfirmButton: true,
      })
    }

    if (status.connectionType !== 'wifi') {
      void SweetAlertToast({
        icon: 'error',
        text: `Please enable Wifi first`,
        showConfirmButton: true,
      })

      return
    }

    try {
      await logCurrentNetworkStatus(status)

      console.log('Wifi initialized')

      void SweetAlertToast({
        icon: 'info',
        text: `Wifi initialized`,
        showConfirmButton: true,
      })
    } catch (error: any) {
      console.error(error)

      setWifiError(`LogCurrentNetworkStatus: ${error?.toString() as string}`)
    }
  }

  useEffect(() => {
    void initWifi()
  }, [])

  // if (wifiError) {
  //   return (
  //     <>
  //       <h1 className="text-3xl font-bold">Wifi</h1>
  //       <Ui_Alert variant="error" style={{ marginTop: 20 }}>
  //         {wifiError}
  //       </Ui_Alert>
  //     </>
  //   )
  // }

  return (
    <>
      <h1 className="text-3xl font-bold">Wifi</h1>

      {wifiError && (
        <Ui_Alert variant="error" style={{ marginTop: 20 }}>
          {wifiError}
        </Ui_Alert>
      )}

      <h4 className="text-2xl mb-2">Location</h4>

      {locationPermission && (
        <table style={{ width: '100%', marginBottom: 20, textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ width: 200 }}>Key</th>
              <th>Permission state</th>
            </tr>
          </thead>
          <tbody>
            {locationPermission &&
              Object.entries(locationPermission).map((entry, index) => (
                <tr key={index}>
                  <td>{entry?.[0]}</td>
                  <td>{`${(entry?.[1] as string) || ''}`}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {!location && <>No location available</>}

      {location && (
        <table style={{ width: '100%', marginBottom: 20, textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ width: 200 }}>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {location?.coords &&
              Object.entries(location.coords).map((entry, index) => (
                <tr key={index}>
                  <td>{entry?.[0]}</td>
                  <td>{`${entry?.[1] || ''}`}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      <h4 className="text-2xl mb-2">Network</h4>
      <table style={{ maxWidth: 400, width: '100%' }}>
        <thead>
          <tr>
            <th>Typ</th>
            <th>Wert</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Connected:</td>
            <td>{`${wifi2?.status?.connected as string}`}</td>
          </tr>
          <tr>
            <td>connectionType:</td>
            <td>{`${wifi2?.status?.connectionType as string}`}</td>
          </tr>
          <tr>
            <td>SSID:</td>
            <td>{`${wifi2?.ssid as string}`}</td>
          </tr>
          <tr>
            <td>IP:</td>
            <td>{`${wifi2?.ip as string}`}</td>
          </tr>
        </tbody>
      </table>
      <Ui_Button
        style={{ marginBottom: 15, marginTop: 20 }}
        variant="secondary"
        size="full"
        outline={true}
        onClick={() => void Wifi.connect({ ssid: wifi2?.ssid, password: 'plasticpony97mnbvcxya' })}
      >
        Connect
      </Ui_Button>
      <br />
      <Ui_Button size="full" variant="primary" onClick={() => void Wifi.disconnect()}>
        Disconnect
      </Ui_Button>
      <br />
      <Ui_Button size="full" variant="primary" onClick={() => void printCurrentPosition()} className="mt-4 mb-6">
        Locate me
      </Ui_Button>
      <br />
    </>
  )
}

export default WifiPage
