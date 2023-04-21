/* eslint-disable react/react-in-jsx-scope */
import { useContext, useState } from 'react'
// @mui
import { alpha } from '@mui/material/styles'
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import useApi from '../../../../hooks/useApi/useApi'
import { AuthContex } from '../../../App.jsx'
// mocks_
import account from '../../../_mock/account'
import { Navigate } from 'react-router-dom';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { auth, setAuth } = useContext(AuthContex)

  const [response, loading, handleRequest] = useApi()

  const [open, setOpen] = useState(null)

  const [navegar, setNavegar] = useState(false)

  const handleOpen = (event) => {
    setOpen(event.currentTarget)
  }

  const handleClose = () => {
    setAuth({ token: '', authenticated: false, user: '' })
    setNavegar(true)
    setOpen(null)
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src="../../../src/assets/images/avatars/avatar_12.jpg" alt="photoURL" />
      </IconButton>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Divider sx={{ borderStyle: 'dashed' }} />
        {
        navegar ? (<Navigate to="/" />) : (<MenuItem onClick={handleClose} sx={{ m: 1 }}>Logout</MenuItem>)
        }
      </Popover>
    </>
  )
}
