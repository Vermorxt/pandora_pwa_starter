import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'de.grob.balkonkraftwerk',
  appName: 'AppStarter',
  webDir: 'out',
  bundledWebRuntime: false,
  plugins: {
    BluetoothLe: {
      displayStrings: {
        scanning: 'Am Scannen...',
        cancel: 'Abbrechen',
        availableDevices: 'Verfügbare Geräte',
        noDeviceFound: 'Kein Gerät gefunden',
      },
    },
  },
  ios: {
    contentInset: 'always',
  },
  // server: {
  //   url: 'http://10.0.2.2:8080',
  //   cleartext: true,
  // },
}

export default config
