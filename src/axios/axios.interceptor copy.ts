import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { buildCancellablePromise, CancellablePromise, Cancellation } from 'real-cancellable-promise'
import { HttpStatus } from '../_enums/enums'
import { AnyType } from '../_types/anytype'
import { addSecureHeader } from './auth'

export interface CancellableAxiosMultipleProps {
  name: string
  url: string
  response: AxiosResponse
}

const showError = (error: AxiosError, status: HttpStatus) => {
  if (axios.isCancel(error)) {
    console.error(`request cancelled:${error.message}`)
  }

  switch (status) {
    case HttpStatus.UNAUTHORIZED:
      console.error('not authorized ...')
      break
    case HttpStatus.NOT_FOUND:
      console.error('not found ...')
      break
    case HttpStatus.PRECONDITION_FAILED:
      console.error('precondition failed ...')
      break
    case HttpStatus.UNPROCESSABLE_ENTITY:
      console.error('Unprocessable entity ...')
      break
    case HttpStatus.BAD_REQUEST:
      console.error('Missing endpoint ...')
      break
    default:
      console.error('Non-matching error ...', status)
  }
}

// NOTE: use functions below to intercept API requests on public and private level!

export const usePrivateInterceptorAxios = () => {
  addSecureHeader()

  axios.interceptors.response.use(
    response => response,

    (error: AxiosError) => {
      const status = error?.response?.status

      if (status) showError(error, status)

      return Promise.reject(error)
    }
  )
}

export const usePublicInterceptorAxios = () => {
  axios.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      const status = error?.response?.status

      if (status) showError(error, status)

      return Promise.reject(error)
    }
  )
}

export const axiosWithoutAuthHeader = () => {
  const axiosInstance = axios.create()
  delete axiosInstance.defaults.headers.common.Authorization

  return axiosInstance
}

export const cancellableAxiosMultiple = (endpoints: CancellableAxiosMultipleProps[]): CancellablePromise<any> =>
  buildCancellablePromise(async capture => {
    const fetchPromises = endpoints.map(endPoint => cancellableAxios({ url: endPoint.url }))
    const res = await capture(CancellablePromise.all(fetchPromises))

    return res as AnyType[]
  })

export const cancellableAxios = (config: AxiosRequestConfig) => {
  const source = axios.CancelToken.source()
  const axiosConfig = { ...config, cancelToken: source.token }

  const promise = axios(axiosConfig)
    .then((response: AxiosResponse<AnyType, AnyType>) => response.data)
    .catch((error: AxiosError) => {
      const status = error?.response?.status

      if (error instanceof axios.Cancel && status) {
        showError(new Cancellation() as AxiosError, status)
      }

      if (status) showError(error, status)
    })

  return new CancellablePromise<any>(promise, () => source.cancel())
}
