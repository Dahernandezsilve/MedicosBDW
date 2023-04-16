/* eslint-disable react/react-in-jsx-scope */
import { Navigate, useRoutes } from 'react-router-dom'
// layouts
import DashboardLayout from './layouts/dashboard'
// Pages
import Doctor from './pages/Doctor/Doctor'
import UserPage from './pages/UserPage/UserPage'
import Welcome from './pages/Welcome/Welcome'
import { element } from 'prop-types'

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
        { element: <Navigate to="/app" />, index: true },
        { path: 'app', element: <Doctor /> },
        { path: 'expediente', element: <UserPage /> },
      ],
    },
  ])

  return routes
}
