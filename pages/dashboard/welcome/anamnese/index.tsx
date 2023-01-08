import { Ui_Button, Ui_Hero } from '@vermorxt/pandora_ui'
import { useRouter } from 'next/router'

const AnamnesePage = () => {
  const router = useRouter()

  return (
    <Ui_Hero style={{ minHeight: 'calc(100vh - 140px)' }} bgColor="base-100">
      <Ui_Hero.Content className="text-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold">
            Wann bist du zu hause?
            <br />
          </h1>
          <small>Du machst das gut!</small>
          <p className="py-4">Bitte wähle folgende Profile aus!</p>
          <p className="py-4">
            Wenn du zu Hause bist, werden voraussichtlich mehr Verbraucher aktiv sein. Wir werden die Einstellungen
            dahingehend optimieren und für die bestmögliche Effizienz sorgen.
          </p>

          <Ui_Button
            className="mb-4"
            variant="secondary"
            size="full"
            onClick={() => void router.push('/dashboard/households')}
          >
            Profil speichern
          </Ui_Button>
        </div>
      </Ui_Hero.Content>
    </Ui_Hero>
  )
}

export default AnamnesePage
