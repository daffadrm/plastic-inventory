export const colorChartBusiness = (typeParam: string) => {
  switch (typeParam) {
    case 'total jumlah barang':
      return '#2a9d8f'
    default:
      return '#5470c6'
  }
}

export const colorTimeBussinees = (typeParam: string) => {
  switch (typeParam) {
    case 'penjualan':
      return '#59cd90'

    case '1 - 3 days':
      return '#ffc857'

    case 'pembelian':
      return '#d7263d'
    default:
      return '#defabb'
  }
}
