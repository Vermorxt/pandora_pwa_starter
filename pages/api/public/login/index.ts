import { AxiosError } from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export interface ProductRole {
  product: string
  role: string
}

export interface User {
  token?: string
  name: string
  isSuperAdmin: boolean
  roles: ProductRole[]
  profileImageUrl?: string
  currentProductRole?: string
}

export interface UserApiResponse {
  data?: User
  error?: AxiosError | null
}

const login = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    token: '1234',
    name: 'John Doe',
    isSuperAdmin: true,
    roles: ['admin'],
    profileImageUrl: '',
    currentProductRole: 'admin',
  })
}

export default login
