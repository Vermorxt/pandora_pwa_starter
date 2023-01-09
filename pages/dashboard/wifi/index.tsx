import { Wifi } from '@capacitor-community/wifi'
import { Network } from '@capacitor/network'
import { Ui_Alert, Ui_Button } from '@vermorxt/pandora_ui'
import { useEffect, useState } from 'react'
import SweetAlertToast from '../../../src/components/SweetAlert/sweet-alert-toast'

const WifiPage = () => {
  const [wifi2, setWifi2] = useState<any>({ ssid: 'nope', ip: '0.0.0.0' })
  const [wifiError, setWifiError] = useState<string>()

  const logCurrentNetworkStatus = async () => {
    void SweetAlertToast({
      icon: 'info',
      text: `Check wifi`,
      showConfirmButton: true,
    })

    const status = await Network.getStatus()

    const ssid = await Wifi.getSSID()
    const ip = await Wifi.getIP()

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
    try {
      await logCurrentNetworkStatus()

      console.log('Wifi initialized')

      void SweetAlertToast({
        icon: 'info',
        text: `Wifi initialized`,
        showConfirmButton: true,
      })
    } catch (error: any) {
      console.error(error)

      setWifiError(error?.toString() as string)
    }
  }

  useEffect(() => {
    void initWifi()
  }, [])

  if (wifiError) {
    return (
      <>
        <h1 className="text-3xl font-bold">Wifi</h1>
        <Ui_Alert variant="error" style={{ marginTop: 20 }}>
          {wifiError}
        </Ui_Alert>
      </>
    )
  }

  return (
    <>
      <h1 className="text-3xl font-bold">Wifi</h1>
      <table style={{ maxWidth: 400, width: '100%' }}>
        <thead>
          <th>
            <td>Typ</td>
          </th>
          <th>
            <td>Wert</td>
          </th>
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
    </>
  )
}

export default WifiPage
