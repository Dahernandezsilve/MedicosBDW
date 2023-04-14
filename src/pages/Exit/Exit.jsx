import React from 'react'
import { navigate } from '../index.jsx'

function Exit() {
  return (
    <div onClick={() => navigate('Welcome')}>
      Exit
    </div>
  )
}

export default Exit
