import dayjs from 'dayjs'
import React, { FC, ReactNode } from 'react'
import { Ui_Link, Ui_Spinner } from '@vermorxt/pandora_ui'
import { COPYRIGHT, GITHUB_REPO_LINK, PROJECT_NAME } from '../../_constants/main'

export interface LoadingProps {
  color?: string
  loadingText?: string
  children?: ReactNode
}

const ContentLoading: FC<LoadingProps> = props => {
  const { children, loadingText, color } = props
  return (
    <>
      <div className="flex h-screen">
        <div className="m-auto">
          {children && children}
          {!children && (
            <>
              <Ui_Spinner color={color} /> <p {...props}>{loadingText || 'loading'}</p>
            </>
          )}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 'auto',
          margin: '0 auto',
          backgroundColor: 'rgba(0,0,0,0.08)',
          textAlign: 'center',
        }}
      >
        <p className="text-sm bg-base-200 font-thin text-gray-400 p-2">
          {COPYRIGHT} {dayjs().year()} -{' '}
          <Ui_Link target="_blank" href={GITHUB_REPO_LINK}>
            {PROJECT_NAME}
          </Ui_Link>
        </p>
      </div>
    </>
  )
}

export default ContentLoading
