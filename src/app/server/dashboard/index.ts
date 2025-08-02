import { apiService, getHeader } from '../apiService'

// import { localApiService } from '../localApiService'

const versioning1 = process.env.NEXT_PUBLIC_API_V1

export const getDashboard = async () => {
  // const response = await localApiService('/dummyDashboard.json', 'GET', null, () => false)
  const response = apiService(`${versioning1}/dashboard`, 'GET', null, getHeader())

  return response
}
