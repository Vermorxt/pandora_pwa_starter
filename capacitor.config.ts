import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.example.app',
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
}

export default config
