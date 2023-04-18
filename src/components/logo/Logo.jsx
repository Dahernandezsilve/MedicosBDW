/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/react-in-jsx-scope */
import PropTypes from 'prop-types'
import { forwardRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
// @mui
import { Box, Link } from '@mui/material'
// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 300,
        height: 50,
        display: 'inline-flex',
        ...sx,
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      <img src="../../../src/assets/MS.svg" alt="Ministerio de salud" />
    </Box>
  )

  if (disabledLink) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{logo}</>
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  )
})

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
}

export default Logo
