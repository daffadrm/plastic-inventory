import axios from 'axios'

export const localApiService = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  headers?: any
) => {
  try {
    const response = await axios({
      url: `${endpoint}`,
      method,
      data,
      headers
    })

    return response.data
  } catch (error: any) {
    throw error
  }
}
