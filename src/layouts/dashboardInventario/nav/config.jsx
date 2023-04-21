/* eslint-disable react/react-in-jsx-scope */
// component
import SvgColor from '../../../components/svg-color'

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`src/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />

const navConfig = [
  {
    title: 'estado inventario',
    path: '/dashboardInventario/inventario',
    icon: icon('ic_user'),
  },
  {
    title: 'solicitud insumo',
    path: '/dashboardInventario/solicitudInsumo',
    icon: icon('ic_cart'),
  },
  {
    title: 'nueva consulta',
    path: '/dashboard/nuevaconsulta',
    icon: icon('ic_lock'),
  },
]

export default navConfig
