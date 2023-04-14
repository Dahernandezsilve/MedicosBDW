import React from "react"
import {navigate}    from "../index.jsx";
import '../../components/Login/Login.css'
import { useState } from "react"
import useApi from "../../../hooks/useApi/useApi.js";
import MS from '../../assets/MS.svg'
import flecha from '../../assets/flecha-curva.png'

const SignUpContainer = ({handleLogin, dpi, nombre, response, setDpi, setNombre, loading}) => {
    return (
        <div className='form-container sign-up-container'>
            <form>
                <img className='svgI' src={MS}></img>
                <h1 className='titleForm2'>Registrarse</h1>
                <input placeholder='DPI' onChange={({target: {value}}) => setDpi(value)} />
                <input placeholder='Nombre' onChange={({target: {value}}) => setNombre(value)}/>
                <input placeholder='Contraseña' onChange={({target: {value}}) => setNombre(value)}/>
                <input placeholder='Clave' onChange={({target: {value}}) => setNombre(value)}/>
                <button className='btnForm' type="button" onClick={() => {
                    handleLogin()
                    navigate('Exit')
                }}>Continuar</button>
                {
                    loading ? 'loading' : ''
                }
                {
                    JSON.stringify(response)
                }
            </form>
        </div>
    )
}

const LoginContainer = ({handleLogin, response, setDpi, setClave, loading}) => {
    return (
        <div className='form-container login-container'>
            <form>
                <img className='svgI' src={MS}></img>
                <h1 className='titleForm'>Ingresar</h1>
                <input placeholder='DPI' onChange={({target: {value}}) => setDpi(value)}/>
                <input placeholder='Contraseña' onChange={({target: {value}}) => setClave(value)}/>
                <button className='btnForm' type="button" onClick={() => {
                    const answer = handleLogin()
                }}>Acceder</button>
                {
                    loading ? 'loading' : ''
                }
                {
                    JSON.stringify(response)
                }
            </form>
        </div>
    )
}

const Login = () => {
    const [response, loading, handleRequest] = useApi()
    const [dpi, setDpi] = useState('')
    const [nombre, setNombre] = useState('')

    const [clave, setClave] = useState('')
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
        await handleRequest('POST', '/login', {dpi: parseInt(dpi, 10).toString(), clave})
        console.log('logeado')
    }

    return (
        <div className={containerClass}>
            <SignUpContainer
                handleLogin={handleLogin}
                dpi={dpi}
                nombre={nombre}
                response={response}
                setDpi={setDpi}
                setNombre={setNombre}
                loading={loading}
            />
            <LoginContainer
                handleLogin={handleLogin}
                response={response}
                setDpi={setDpi}
                setClave={setClave}
                loading={loading}
            />
            <div className='overlay-container'>
                <div className='overlay'>
                    <div className={`overlay-panel overlay-left ${showLogin ? 'show' : ''}`}>
                        <h1>¿Ya tienes un usuario?</h1>
                        <p>Accede con tu DPI aquí</p>
                        <img className='flechaI' src={flecha}></img>
                        <button className='btn' onClick={handleLoginClick}>Acceder</button>
                    </div>
                    <div className={`overlay-panel overlay-right ${showSignUp ? 'show' : ''}`}>
                        <h1>Bienvenido</h1>
                        <p>¿Tienes problemas para acceder?<br></br> Regístrate aquí</p>
                        <img className='flechaD' src={flecha}></img>
                        <button className='btn' onClick={handleSignUpClick}>Registrarse</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login