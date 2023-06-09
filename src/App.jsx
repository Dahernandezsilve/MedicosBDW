/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable import/extensions */
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { createContext, useState } from 'react'
import Router from './routes'

import Doctor from './pages/Doctor/Doctor'
import Page from './pages/index.jsx'
// routes
// theme
import ThemeProvider from './theme'
// components
import { StyledChart } from './components/chart'
import ScrollToTop from './components/scroll-to-top'
import DashboardLayout from './layouts/dashboard/DashboardLayout'

export const AuthContex = createContext()

function App() {
  const [auth, setAuth] = useState({
    token: '',
    authentication: false,
    user: '',
  })
  /*
    useEffect(() => {
        handleRequest('POST', '/login', {dpi: 123456789123, nombre:'Diego'})
    },[])
  */

  return (
    <AuthContex.Provider value={{ auth, setAuth }}>
      <div className="App">
        <HelmetProvider>
          <BrowserRouter>
            <ThemeProvider>
              <ScrollToTop />
              <StyledChart />
              <Router />
            </ThemeProvider>
          </BrowserRouter>
        </HelmetProvider>
      </div>
    </AuthContex.Provider>
  )
}
export default App
