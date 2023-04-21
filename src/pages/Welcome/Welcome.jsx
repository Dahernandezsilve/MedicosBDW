import React, {useContext, useEffect, useState} from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import { navigate } from '../index.jsx'
import '../../components/Login/Login.css'
import useApi from '../../../hooks/useApi/useApi.js'
import MS from '../../assets/MS.svg'
import flecha from '../../assets/flecha-curva.png'
import { any } from 'prop-types'
import { AuthContex } from '../../App.jsx'
import { set } from 'lodash'

function SignUpContainer({
  handleSingin, dpi, nombre, response, setDpi, setNombre, loading, handleEnter, mensaje, setClave, setCodigo
}) {
  return (
    <div className="form-container sign-up-container">
      <form>
        <img className="svgI" src={MS} />
        <h1 className="titleForm2">Registrarse</h1>
        <input placeholder="DPI" onChange={({ target: { value } }) => setDpi(value)} />
        <input placeholder="Nombre" onChange={({ target: { value } }) => setNombre(value)} />
        <input placeholder="Contraseña" onChange={({ target: { value } }) => setClave(value)} />
        <input placeholder="Clave" onChange={({ target: { value } }) => setCodigo(value)} />
        {
          mensaje ? (<h1 className="titleForm2">Registró exitoso "Ve a la otra pestaña"</h1>) : (<button className="btnForm" type="button" onClick={handleSingin}>Registrarse</button>)
        }

      </form>
    </div>
  )
}

function LoginContainer({
  handleLogin, response, setDpi, setClave, loading, navegar, handleEnter, handleNavegate, handleUser
}) {
  return (
    <div className="form-container login-container">
      <form>
        <img className="svgI" src={MS} />
        <h1 className="titleForm">Ingresar</h1>
        <input placeholder="DPI" onChange={({ target: { value } }) => setDpi(value)} />
        <input placeholder="Contraseña" onKeyUp={handleEnter} type="password" onChange={({ target: { value } }) => setClave(value)} />
        {
        navegar ? (<Navigate to={handleNavegate(response.rol)} />) : (<button className="btnForm" type="button" onClick={handleLogin}>Acceder</button>)
        }
      </form>
    </div>
  )
}

function Login() {
  const { auth, setAuth } = useContext(AuthContex)
  const [response, loading, handleRequest] = useApi()
  const [dpi, setDpi] = useState('')
  const [nombre, setNombre] = useState('')
  const [navegar, setNavegar] = useState(false)
  const [rol, setRol] = useState('')
  const [mensaje, setMensaje] = useState('')

  const [clave, setClave] = useState('')
  const [codigo, setCodigo] = useState('')
  const [showSignUp, setShowSignUp] = useState(false)
  const [showLogin, setShowLogin] = useState(true)

  const containerClass = `container ${showSignUp ? 'right-panel-active' : ''}`

  const handleSignUpClick = () => {
    setShowSignUp(true)
    setShowLogin(false)
  }

  const handleLoginClick = () => {
    setShowSignUp(false)
    setShowLogin(true)
  }

  const handleLogin = async () => {
    await handleRequest('POST', '/login', { dpi: parseInt(dpi, 10).toString(), clave })
  }

  const handleSingin = async () => {
    await handleRequest('POST', '/singin', { dpi, nombre, clave, codigo_acceso: codigo })
  }

  const handleNavegate = (responseRol) => {
    if (responseRol !== null && responseRol !== undefined) {
      if (responseRol === 'Admin') {
        setRol('/dashboardAdmin/Bitacora')
      }
      if (responseRol === 'Medico') {
        setRol('/dashboard/expediente')
      }
      if (responseRol === 'Inventario') {
        setRol('/dashboardInventario/inventario')
      }
    }
    return rol
  }

  useEffect(() => {
    console.log('respuesta', response)
    if (response!==null && response!==undefined) {
      const verificador = response.message
      console.log('mensaje', verificador)
      if (verificador === 'Se encontro un match Login correcto') {
        console.log('Ir a otro sitio')
        setAuth({ token: response.sessionToken, authenticated: true })
        console.log(auth.token)
        console.log(auth.authentication)
        setNavegar(true)
      }
      if (verificador === 'Datos agregados exitosamente') {
        setMensaje(true)
      }
    }
  }, [response])

  const handleEnter = async (event) => {
    if (event.keyCode === 13) {
      console.log('Se presionó Enter')
      handleLogin()
    }
  }

  return (
    <div className="containerPrincipal">
      <div className={containerClass}>
        <SignUpContainer
          handleSingin={handleSingin}
          dpi={dpi}
          nombre={nombre}
          response={response}
          setDpi={setDpi}
          setNombre={setNombre}
          setClave={setClave}
          loading={loading}
          mensaje={mensaje}
          setCodigo={setCodigo}
        />
        <LoginContainer
          handleLogin={handleLogin}
          response={response}
          setDpi={setDpi}
          setClave={setClave}
          loading={loading}
          navegar={navegar}
          handleEnter={handleEnter}
          handleNavegate={handleNavegate}
        />
        <div className="overlay-container">
          <div className="overlay">
            <div className={`overlay-panel overlay-left ${showLogin ? 'show' : ''}`}>
              <h1>¿Ya tienes un usuario?</h1>
              <p>Accede con tu DPI aquí</p>
              <img className="flechaI" src={flecha} />
              <button className="btn" onClick={handleLoginClick}>Acceder</button>
            </div>
            <div className={`overlay-panel overlay-right ${showSignUp ? 'show' : ''}`}>
              <h1>Bienvenido</h1>
              <p>
                ¿Tienes problemas para acceder?
                <br />
                {' '}
                Regístrate aquí
              </p>
              <img className="flechaD" src={flecha} />
              <button className="btn" onClick={handleSignUpClick}>Registrarse</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
