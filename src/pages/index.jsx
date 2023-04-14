/* eslint-disable import/extensions */
/* eslint-disable import/no-cycle */
import React from 'react'
import Exit from './Exit/Exit.jsx'
import Welcome from './Welcome/Welcome.jsx'

const navigate = (page) => {
  window.location = `/?route=${page}`
}

function Page() {
  const route = new URLSearchParams(window.location.search)

  switch (route.get('route')) {
    case 'Welcome':
      return <Welcome />
    case 'Exit':
      return <Exit />
    default:
      return <Welcome />
  }
}

export { navigate }
export default Page
