/* eslint-disable react/react-in-jsx-scope */
import { Navigate, useRoutes } from 'react-router-dom'
// layouts
import DashboardLayout from './layouts/dashboard'
// Pages
import Doctor from './pages/Doctor/Doctor'
import UserPage from './pages/UserPage/UserPage'
import Welcome from './pages/Welcome/Welcome'
import { element } from 'prop-types'
import Estadisticas from './pages/Estadisticas/Estadisticas'
import DashboardLayoutAdmin from './layouts/dashboardAdmin/DashboardLayoutAdmin'
import DashboardLayoutInventario from './layouts/dashboardInventario/DashboardLayoutInventario'
import EstadoInventario from './pages/EstadoInventario/EstadoInventario'
import Bitacora from './pages/Bitacora/Bitacora'
import EstadisticasAdmin from './pages/EstadisticasAmin/EstadisticasAdmin'
import NuevaConsulta from './pages/NuevaConsulta/NuevaConsulta'
import TrasladarMedico from './pages/TrasladarMedico/TrasladarMedico'
import SolicitudInsumo from './pages/SolicitudInsumo/SolicitudInsumo'
import Mantenimientos from './pages/Mantenimientos/Mantenimientos'

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <Welcome />,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/expediente" />, index: true },
        { path: 'expediente', element: <UserPage /> },
        { path: 'estadisticas', element: <Estadisticas /> },
        { path: 'nuevaconsulta', element: <NuevaConsulta /> },
      ],
    },
    {
      path: '/dashboardAdmin',
      element: <DashboardLayoutAdmin />,
      children: [
        { element: <Navigate to="/bitacora" />, index: true },
        { path: 'bitacora', element: <Bitacora /> },
        { path: 'estadisticasAdmin', element: <EstadisticasAdmin /> },
        { path: 'mantenimientos', element: <Mantenimientos /> },
        { path: 'trasladarMedico', element: <TrasladarMedico /> },
      ],
    },
    {
      path: '/dashboardInventario',
      element: <DashboardLayoutInventario />,
      children: [
        { element: <Navigate to="/inventario" />, index: true },
        { path: 'inventario', element: <EstadoInventario /> },
        { path: 'solicitudInsumo', element: <SolicitudInsumo /> },
      ],
    },
  ])

  return routes
}
