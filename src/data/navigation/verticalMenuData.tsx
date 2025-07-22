// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'tabler-home'
  },
  {
    label: 'Map',
    href: '/map',
    icon: 'tabler-map-search'
  },
  {
    label: 'Aktivitas dan Kategori',
    href: '/activity-category',
    icon: 'tabler-clipboard-data'
  },
  {
    label: 'List Bidang',
    href: '/land',
    icon: 'tabler-squares'
  }
]

export default verticalMenuData
