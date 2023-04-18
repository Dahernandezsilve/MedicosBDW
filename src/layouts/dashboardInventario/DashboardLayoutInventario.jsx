/* eslint-disable react/react-in-jsx-scope */
import { useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
// @mui
import { styled } from '@mui/material/styles'
//
import Header from './header'
import Nav from './nav'
import { AuthContex } from '../../App'
import useApi from '../../../hooks/useApi/useApi'
// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64
const APP_BAR_DESKTOP = 92

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
})

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}))

// ----------------------------------------------------------------------

export default function DashboardLayoutInventario() {
  const [open, setOpen] = useState(false)

  const { auth, setAuth } = useContext(AuthContex)
  const [response, loading, handleRequest] = useApi()

  const handleUser = async () => {
    await handleRequest('GET', '/confirmar', '', auth.token)
  }

  useEffect(() => {
    handleUser()
  }, [])

  useEffect(() => {
    if (response !== null && response !== undefined) {
      console.log('respuesta', response)
    }
  }, [response])

  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />

      <Nav openNav={open} onCloseNav={() => setOpen(false)} response={response} />

      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  )
}
