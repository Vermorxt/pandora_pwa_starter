import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { buildCancellablePromise, CancellablePromise, Cancellation } from 'real-cancellable-promise'
import { HttpStatus } from '../_enums/http-status'
import { AnyType } from '../_types/anytype'
import { addSecureHeader } from './auth'
import { CancellableAxiosMultipleProps } from './axios.interceptor copy'

const showError = (error: AxiosError, status: HttpStatus) => {
  if (axios.isCancel(error)) {
    return
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

export const usePrivateInterceptorAxios = () => {
  addSecureHeader()

  axios.interceptors.response.use(
    response => response,

    (error: AxiosError) => {
      const status = error?.response?.status as number

      showError(error, status)

      return Promise.reject(error)
    }
  )
}

export const usePublicInterceptorAxios = () => {
  axios.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      const status = error?.response?.status as HttpStatus

      showError(error, status)

      return Promise.reject(error)
    }
  )
}

export const axiosWithoutAuthHeader = () => {
  const axiosInstance = axios.create()
  delete axiosInstance.defaults.headers.common.Authorization

  return axiosInstance
}

// NOTE:  example cancellableAxiosMultiple
// useEffect(() => {
//   const fetchDataFor: CancellableAxiosMultipleProps[] = [
//     {
//       name: 'authors',
//       url: `${process.env.API_URL}${ApiPregnancyDefinition.GET_AUTHORS}`,
//       response: null,
//     },
//   ]

//   const apiResponse = cancellableAxiosMultiple(fetchDataFor)
//     .then((fetchedData: any[]) => {
//       console.log(fetchedData)
//     })
//     .catch(console.error)

//   return apiResponse.cancel
// }, [])

export const cancellableAxiosMultiple = (endpoints: CancellableAxiosMultipleProps[]): CancellablePromise<any> =>
  buildCancellablePromise(async capture => {
    const fetchPromises = endpoints.map(endPoint => cancellableAxios({ url: endPoint.url }))
    const res = await capture(CancellablePromise.all(fetchPromises))

    return res as AnyType[]
  })

// NOTE:  example cancellableAxios
// useEffect(() => {
//   const apiResponse = cancellableAxios({ url: `${process.env.API_POSTNATAL}${APIEndpoints.Products}` })
//     .then(fetchedData => {
//       console.log(fetchedData)
//     })
//     .catch(error => console.error('failed get data: ', error))

//   return apiResponse.cancel
// }, [])

export const cancellableAxios = async (config: AxiosRequestConfig) => {
  const source = axios.CancelToken.source()

  const promise = axios(config)
    .then((response: AxiosResponse<AnyType, AnyType>) => response.data)
    .catch((error: AxiosError) => {
      const status = error?.response?.status as HttpStatus

      if (error instanceof axios.Cancel) {
        showError(new Cancellation() as AxiosError, status)
      }

      showError(error, status)
    })

  return new CancellablePromise(promise, () => source.cancel())
}
