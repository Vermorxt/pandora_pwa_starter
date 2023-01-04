import { Ui_Button, Ui_Hero } from '@vermorxt/pandora_ui'
import { useRouter } from 'next/router'

const DevicesPage = () => {
  const router = useRouter()

  return (
    <Ui_Hero style={{ minHeight: 'calc(100vh - 140px)' }} bgColor="base-100">
      <Ui_Hero.Content className="text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">
            Welche Geräte hast du?
            <br />
          </h1>
          <small>Du machst das gut!</small>
          <p className="py-6">Bitte wähle aus folgender Liste aus!</p>
          <p className="py-6">
            Der Akku kann maximal 1000 Watt Strom einspeisen. Je genauer wir wissen welche Geräte du hast, um so
            effizienter ist die Abnahme.
          </p>

          <Ui_Button
            className="mb-4"
            variant="secondary"
            size="full"
            onClick={() => void router.push('/dashboard/welcome/anamnese/')}
          >
            Weiter
          </Ui_Button>
          <Ui_Button variant="ghost" size="full" onClick={() => void router.push('/dashboard/')}>
            Das nervt, ich überspinge den Schritt
          </Ui_Button>
        </div>
      </Ui_Hero.Content>
    </Ui_Hero>
  )
}

export default DevicesPage
