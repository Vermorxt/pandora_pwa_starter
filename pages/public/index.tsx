import { Ui_Button, Ui_Hero } from '@vermorxt/pandora_ui'
import { useRouter } from 'next/router'
import { FC } from 'react'

const Index: FC<any> = () => {
  const router = useRouter()

  return (
    <Ui_Hero style={{ minHeight: 'calc(100vh - 140px)' }} bgColor="base-100">
      <Ui_Hero.Content className="text-center">
        <div className="max-w-md flex flex-col" style={{ height: 'calc(100vh - 5rem)' }}>
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h1 className="text-4xl font-bold">
              Dein Balkonkraftwerk Manager
              <br />
            </h1>
            <small>powered by Dr. Grob Energy</small>
            <p className="py-6">Hab deine Energie im Blick und kontrolliere die Hardware!</p>
          </div>
          <span style={{ flexGrow: 1 }}></span>
          <Ui_Button
            className="mb-4"
            variant="primary"
            size="full"
            onClick={() => void router.push('/public/register/')}
          >
            Ich bin ein neuer Nutzer
          </Ui_Button>
          <Ui_Button variant="secondary" size="full" onClick={() => void router.push('/public/login/')}>
            Ich habe einen Account
          </Ui_Button>
        </div>
      </Ui_Hero.Content>
    </Ui_Hero>
  )
}

export default Index
