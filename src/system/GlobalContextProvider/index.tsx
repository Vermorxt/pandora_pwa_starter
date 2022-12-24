import dayjs from 'dayjs'
import React, { createContext, FC, useState } from 'react'

export const GLOBAL_WRAPPER_ID = 'global_wrapper'
export interface UserContextProps {
  [key: string]: unknown // NOTE: so properties can be referred to as object[propertyName]
  firstName?: string
  lastName?: string
  dateOfBirth?: dayjs.Dayjs
}

export interface ApplicationContextProps {
  [key: string]: unknown
  debugMode?: boolean
  debugContextExpanded?: boolean
}

const defaultUserData: UserContextProps = {
  firstName: 'Maria',
  lastName: 'Mustermann',
  dateOfBirth: dayjs().add(7, 'month'), // NOTE: according to research on avg. women know they are pregnant 5.5 weeks in the pregnancy
}

const defaultAppData = {
  debugMode: false,
  debugContextExpanded: false,
}

export interface GlobalContextValues {
  userData: [UserContextProps, React.Dispatch<React.SetStateAction<UserContextProps>>]
  appData: [ApplicationContextProps, React.Dispatch<React.SetStateAction<ApplicationContextProps>>]
}

export const GlobalContext = createContext<GlobalContextValues>({
  userData: [defaultUserData, () => undefined],
  appData: [defaultAppData, () => undefined],
})

export const GlobalContextProvider: FC<any> = ({ children }) => {
  const [userData, setUserData] = useState<UserContextProps>(defaultUserData)
  const [appData, setAppData] = useState<ApplicationContextProps>(defaultAppData)

  const contextValues: GlobalContextValues = {
    userData: [userData, setUserData],
    appData: [appData, setAppData],
  }

  return (
    <GlobalContext.Provider value={contextValues}>
      <div id={GLOBAL_WRAPPER_ID}>{children}</div>
    </GlobalContext.Provider>
  )
}
