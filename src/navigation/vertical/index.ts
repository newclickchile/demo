// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      path: '/dashboards/crm',
      icon: 'mdi:home-outline'
    },
    {
      sectionTitle: 'Facturas',
      icon: 'mdi:invoice'
    },
    {
      title: 'Por Pagar',
      path: '/invoice/list',
      icon: 'mdi:invoice-arrow-right-outline'
    },
    {
      path: '/invoice/list/',
      title: 'Por cobrar',
      icon: 'mdi:invoice-arrow-left-outline'
    }
  ]
}

export default navigation
