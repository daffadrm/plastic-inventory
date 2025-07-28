import { localApiService } from '../localApiService'

export const getDashboard = async () => {
  const response = await localApiService('/dummyDashboard.json', 'GET', null, () => false)

  return response
}
