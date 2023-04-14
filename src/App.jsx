import {useEffect, useState} from 'react'
import './App.css'
import Page from "./pages/index.jsx";


function App() {
  /*
    useEffect(() => {
        handleRequest('POST', '/login', {dpi: 123456789123, nombre:'Diego'})
    },[])
  */
  return (
      <div className="App">
          <Page/>
      </div>
  )
}
export default App
