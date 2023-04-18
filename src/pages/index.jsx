/* eslint-disable import/extensions */
/* eslint-disable import/no-cycle */
import React from 'react'
import Welcome from './Welcome/Welcome.jsx'
import Doctor from './Doctor/Doctor.jsx'

const navigate = (page) => {
  window.location = `/?route=${page}`
}

function Page() {
  const route = new URLSearchParams(window.location.search)

  switch (route.get('route')) {
    case 'Welcome':
      return <Welcome />
    default:
      return <Doctor />
  }
}

export { navigate }
export default Page
