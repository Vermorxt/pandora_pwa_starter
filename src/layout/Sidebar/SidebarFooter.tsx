import { FC, useEffect, useState } from 'react'
import globalSettings from '../../_settings/global.settings'
import scss from './sidebar.module.scss'

const SidebarFooter: FC = props => {
  const [isConnected, setIsConnected] = useState<boolean>(true)

  useEffect(() => {
    window.addEventListener('online', () => {
      setIsConnected(true)
    })
    window.addEventListener('offline', () => {
      setIsConnected(false)
    })
  }, [])

  return (
    <>
      <ul className="menu menu-compact flex flex-col p-0 px-4"> </ul>
      <div
        className="from-base-200 pointer-events-none sticky flex h-20 bg-gradient-to-t to-transparent"
        style={{ bottom: '4.5em' }}
      ></div>
      <div className="sticky bottom-0 flex h-20 bg-gradient-to-t to-transparent" style={{ height: '4.5em' }}>
        <div className="bg-base-200 menu menu-compact flex flex-col p-0 px-4 text-center" style={{ width: '100%' }}>
          <ul className="menu menu-compact flex flex-col p-0">
            <li></li>
          </ul>
          <div className="" style={{ textAlign: 'center', padding: '10px 0' }}>
            <a href="/docs/changelog" className="link link-hover ">
              <div data-tip="Changelog" className="tooltip tooltip-top prose">
                <span className="version">
                  <small>Version: </small>
                </span>
                <small data-tip="Changelog">{globalSettings.version}</small>
              </div>
            </a>
            {isConnected && <span className={`${scss.internet} ${scss.connected}`}></span>}
            {!isConnected && <span className={`${scss.internet} `}></span>}
          </div>
        </div>
      </div>
    </>
  )
}

export default SidebarFooter
