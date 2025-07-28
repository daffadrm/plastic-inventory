import { apiService } from './apiService'

const versioning1 = process.env.NEXT_PUBLIC_API_V1

export const postLogin = async (data: { identifier: string; password: string }): Promise<any> => {
  const response = apiService(`${versioning1}/auth/login/`, 'POST', data)

  return response
}

export const postLoginInitial = async (data: { username: string; refresh_token: string }): Promise<any> => {
  const response = apiService(`${versioning1}/auth/login-initial/`, 'POST', data)

  return response
}

export const postLoginSSO = async (data: { token: string }): Promise<any> => {
  const response = apiService(`${versioning1}/auth/sso/`, 'POST', data)

  return response
}

export const postLoginSSOPrismaTools = async (code: string): Promise<any> => {
  const response = apiService(`${versioning1}/auth/callback-sso?code=${code}`, 'GET', undefined)

  return response
}
