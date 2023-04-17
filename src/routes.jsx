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
  ])

  return routes
}
