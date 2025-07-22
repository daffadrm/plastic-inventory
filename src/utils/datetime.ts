import moment from 'moment-timezone'

const localTimeZone = moment.tz.guess() // Deteksi zona waktu lokal

export const formatDate = (dateParam: string | number, formatParam: string): string => {
  if (!dateParam || dateParam === '-') return '-'

  const date = typeof dateParam === 'number' ? moment.unix(dateParam) : moment.utc(dateParam)

  return date.tz(localTimeZone).format(formatParam) || '-'
}

export const convertDateTimeToEpoch = (dateParam: string) => {
  const isValid = moment(dateParam, true).isValid()

  const epoch = isValid ? String(moment(dateParam).unix()) : ''

  return epoch
}
