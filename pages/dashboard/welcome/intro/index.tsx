import { Ui_Button, Ui_Hero } from '@vermorxt/pandora_ui'
import { useRouter } from 'next/router'

const IntroPage = () => {
  const router = useRouter()

  return (
    <Ui_Hero style={{ minHeight: 'calc(100vh - 140px)' }} bgColor="base-100">
      <Ui_Hero.Content className="text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">
            Willkommen! Lass uns loslegen.
            <br />
          </h1>
          <small>Du machst das gut!</small>
          <p className="py-6">
            Um die Solarenergie bestmöglich zu verteilen und keine überschüssige Energie kostenlos ins öffentliche Netz
            zu speisen, möchten wir ein Profil anlegen, das die bestmögliche Effizienz gewährleistet!
          </p>
          <p className="py-6">
            Der geladene Akku wird aktiviert, sobald Verbraucher Energie benötigen. Anfangs passiert das anhand deines
            Energie Nutzungs-Profils. Später anhand der verbrauchten Energie.
          </p>
          <p className="py-6">Ist das ok für dich?</p>

          <Ui_Button
            className="mb-4"
            variant="secondary"
            size="full"
            onClick={() => void router.push('/dashboard/welcome/devices/')}
          >
            Ja, wir legen ein Profil an
          </Ui_Button>
          <Ui_Button variant="ghost" size="full" onClick={() => void router.push('/dashboard/')}>
            Nein, ich überspinge den Schritt
          </Ui_Button>
        </div>
      </Ui_Hero.Content>
    </Ui_Hero>
  )
}

export default IntroPage
