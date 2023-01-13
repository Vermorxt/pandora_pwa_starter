import { Helper } from '@vermorxt/pandora_utils'
import axios, { AxiosRequestConfig, CancelToken } from 'axios'
import dayjs from 'dayjs'
import Router from 'next/router'
import { firstCharUppercase } from '../components/Breadcrumbs'
import { CmsUserRoles, Product, UrlPublic } from '../_enums/enums'
import { AnyType } from '../_types/anytype'
import { SearchParams } from '../_types/search-params'
import { GlobalContext } from './../system/GlobalContextProvider/index'

export interface SecureHeaderOptions {
  contentType?: string
  cancelToken?: CancelToken
  onUploadProgress?: (event: ProgressEvent) => void
}

export interface ProductRole {
  product: string
  role: string
}

const MAX_LOGIN_TIME_MINUTES = 15

let storedAccessToken: string
let storedAdmin: { name: string; isSuperAdmin: boolean; roles: ProductRole[]; profileImageUrl?: string }
let interval: number
let inactivityStartTime = dayjs().format()

export const getStoredAccessToken = () => storedAccessToken

export const getSecureHeaderPostnatal = (
  params: AxiosRequestConfig & SearchParams,
  options?: SecureHeaderOptions
): Promise<AnyType> =>
  new Promise(resolve => {
    const token = storedAccessToken || window.localStorage.getItem('jwt')

    if (token) {
      return resolve({
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': options?.contentType || 'application/x-www-form-urlencoded',
          apikey: process.env.API_KEY_POSTNATAL,
        },
        params,
      })
    }

    return resolve({
      headers: {
        'Content-Type': options?.contentType || 'application/x-www-form-urlencoded',
      },
      params,
    })
  })

export const addSecureHeader = () => {
  const token = getStoredAccessToken() || window.localStorage.getItem('jwt')
  axios.defaults.headers.common.Authorization = token as string
}

export const removeSecureHeader = () => {
  axios.defaults.headers.common.Authorization = ''
}

export const login = ({ token, name, isSuperAdmin, roles, profileImageUrl }: any, noRedirect: boolean) => {
  try {
    storedAccessToken = token as string
    storedAdmin = { name, isSuperAdmin, roles, profileImageUrl }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('jwt', token as string)
      window.localStorage.setItem('admin', JSON.stringify(storedAdmin))
    }

    if (!noRedirect) {
      void Router.push(UrlPublic.ProjectSelection)
    }

    if (!interval) {
      logoutInactivityTimer()
    }
  } catch (err) {
    console.error('force user logout ... auth.tsx -> login()')

    return logout()
  }
}

export const resetInactivityTimer = () => {
  inactivityStartTime = dayjs().format()
}

export const logoutInactivityTimer = () => {
  if (interval) return

  const eventListeners = ['mousemove', 'mousedown', 'keypress', 'touchmove'].map(event =>
    document.addEventListener(event, resetInactivityTimer, false)
  )

  interval = setInterval(() => {
    const now = dayjs()

    if (dayjs(now).diff(inactivityStartTime) > MAX_LOGIN_TIME_MINUTES * 60 * 1000) {
      clearInterval(interval)

      console.log(
        '%c force user logout ... auth.tsx -> logoutInactivityTimer() ',
        'background: #ff0000; color: #bada55'
      )

      removeSecureHeader()
      void logout()
    }
  }, 10000) as unknown as number
}

export const getJwtLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const jwt = window.localStorage.getItem('jwt')

    if (jwt) {
      storedAccessToken = jwt

      return jwt
    }
  }

  return false
}

export const getAdminLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const adminData = JSON.parse(window.localStorage.getItem('admin') as string)

    if (adminData) {
      storedAdmin = adminData

      return adminData
    }
  }

  return false
}

export const getAdmin = () => {
  if (storedAdmin) {
    return storedAdmin
  }

  return getAdminLocalStorage()
}

export const getSelectedProduct = (): Product => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem('project') as Product
  }

  return null as unknown as Product
}

export const userIsLoggedIn = () => getJwtLocalStorage()

export const getCurrentProductRole = (cmsUser: any, selectedProject: Product) => {
  if (cmsUser.roles && Array.isArray(cmsUser.roles) && cmsUser.roles.length > 0) {
    const usedProject = cmsUser.roles.find(
      (role: any) => role.product === selectedProject?.toLowerCase()
    ) as unknown as any

    if (usedProject) {
      cmsUser.currentProductRole = firstCharUppercase(usedProject.role as string)
    } else {
      cmsUser.currentProductRole = 'Not available'
    }
  }

  if (cmsUser?.isSuperAdmin) {
    cmsUser.currentProductRole = CmsUserRoles.SuperAdmin
  }

  return cmsUser
}

export const logout = async () => {
  storedAccessToken = null as unknown as string

  console.log('%c User logged out! ', 'background: #222; color: #bada55')

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('jwt')
    window.localStorage.removeItem('admin')
    window.localStorage.removeItem('project')
    if (interval) {
      clearInterval(interval)
    }
    await Router.push(UrlPublic.Public)
  }

  return true
}
