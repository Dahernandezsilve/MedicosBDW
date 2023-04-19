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
import NuevaConsulta from './pages/NuevaConsulta/NuevaConsulta'
import DashboardLayoutAdmin from './layouts/dashboardAdmin/DashboardLayoutAdmin'
import DashboardLayoutInventario from './layouts/dashboardInventario/DashboardLayoutInventario'
import EstadoInventario from './pages/EstadoInventario/EstadoInventario'

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
        { element: <Navigate to="/expediente" />, index: true },
        { path: 'expediente', element: <UserPage /> },
        { path: 'estadisticas', element: <Estadisticas /> },
        { path: 'nuevaconsulta', element: <NuevaConsulta /> },
      ],
    },
    {
      path: '/dashboardInventario',
      element: <DashboardLayoutInventario />,
      children: [
        { element: <Navigate to="/inventario" />, index: true },
        { path: 'inventario', element: <EstadoInventario /> },
        { path: 'estadisticas', element: <Estadisticas /> },
        { path: 'nuevaconsulta', element: <NuevaConsulta /> },
      ],
    },
  ])

  return routes
}
