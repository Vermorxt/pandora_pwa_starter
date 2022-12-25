import { AxiosError } from 'axios'
import { HttpStatus } from '../_enums/enums'

export interface ApiRest {
  get?: string
  post?: string
  patch?: string
  delete?: string
}

export interface AxiosErrorInterface extends AxiosError {
  request?: {
    status?: HttpStatus
  }
}
