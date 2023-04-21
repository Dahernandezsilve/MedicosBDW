/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
/* eslint-disable react/react-in-jsx-scope */

import { Helmet } from 'react-helmet-async'
import { filter, set } from 'lodash'
import { sentenceCase } from 'change-case'
import InputAutoComplete from '../../components/InputAutoComplete/InputAutoComplete'
import {
  useContext, useState, useEffect, createContext,
} from 'react'
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material'
// components
import Label from '../../components/label'
import Iconify from '../../components/iconify'
import Scrollbar from '../../components/scrollbar'
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user'
// mock
import USERLIST from '../../_mock/user'
import useApi from '../../../hooks/useApi/useApi'
import { AuthContex } from '../../App.jsx'
import Modal from '../../components/Modal/Modal'
import './Mantenimientos.css'
import { Await } from 'react-router-dom'
import { value } from 'lodash/seq'

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'date', label: 'Fecha', alignRight: false },
  { id: 'nameDoctor', label: 'Doctor', alignRight: false },
  { id: 'description', label: 'Descripcion', alignRight: false },
  { id: 'evolution', label: 'Evolución', alignRight: false },
  { id: 'healthUnit', label: 'Unidad de salud', alignRight: false },
  { id: 'disease', label: 'Enfermedad', alignRight: false },
  { id: '' },
]



const SelectorDeOpciones = ({ setRespuesta, respuesta }) => {
  const opciones = ['Medico', 'Inventario', 'Admin'];
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(respuesta);

  const handleChange = (e) => {
    setOpcionSeleccionada(e.target.value);
    setRespuesta(e.target.value);
  };

  return (
    <div>
      <label>Selecciona una opción:</label>
      <select value={opcionSeleccionada} onChange={handleChange}>
        <option value="">Selecciona una opción</option>
        {opciones.map((opcion, index) => (
          <option key={index} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
      {respuesta && <p>La opción seleccionada es: {respuesta}</p>}
    </div>
  );
};

const tableTratamientos = [
  { id: 'descripción', label: 'Descripción', alignRight: false },
  { id: 'dosis', label: 'Dosis', alignRight: false },
  { id: 'fechaInicio', label: 'Fecha de inicio', alignRight: false },
  { id: 'fechaFin', label: 'Fecha de finalización', alignRight: false },
  { id: '' },
]

const tableExamenes = [
  { id: 'idExam', label: 'ID del examen', alignRight: false },
  { id: 'nameExam', label: 'Nombre del examen', alignRight: false },
  { id: '' },
]
// ----------------------------------------------------------------------


export default function Mantenimientos() {
  const { auth, setAuth } = useContext(AuthContex)

  const [response, loading, handleRequest] = useApi()

  const [rol, setRol] = useState('')
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)

  const handleAccesCode = async () => {
    await handleRequest('POST', '/access_code', { role: rol }, auth.token)
  }

  const [nameText, setNameText] = useState('')
  const [dpiText, setDpiText] = useState('')
  const [claveText, setClaveText] = useState('')
  const [rolText, setRolText] = useState('')
  const [optionsToUsers, setOptionsToUsers] = useState([])


  const handleGetOptionsPerson = async (value) => {
    setNameText(value)
    setOpen(false)
    await handleRequest('POST', '/usersInstant', {key: value}, auth.token)
  }

  useEffect(() => {
    if (response.access_code !== undefined && response.access_code !==''){
      setShow(true)
    } else if(response.type !== undefined && response.type === 'User'){
      setOptionsToUsers(response.data.map( (dat) => ({
        value: dat.nameUser,
        description: dat.dpiUser
      })))

    } else if(response.type !== undefined && response.type === 'USERPT'){
      console.log(response.data)
      setRolText(response.data[0].rol)
      setClaveText(response.data[0].clave)

    } if(response.type !== undefined && response.type === 'Update'){
      console.log(response.data)
      setRolText('')
      setClaveText('')
      setDpiText('')
      setClaveText('')
      setNameText('')
      setOpen(false)
    }


  }, [response])

  const setKey = (value) => {
    setDpiText(value)
    setOpen(true)
  }


  useEffect(
    () => {

      if(open){
        handleRequest('POST', '/confirmUser', {key: dpiText}, auth.token)
      }

    },
    [open]
  )

  const handleClickleable = () => {
    handleRequest('POST', '/editUser', {dpi: dpiText, rol: rolText, clave: claveText, nombre: nameText}, auth.token)
  }


  useEffect(() => {
    console.log('accesCode', response)
  }, [response])


  useEffect(() => {
    console.log('dpi', dpiText)
  }, [dpiText])

  return (
    <div>
     <Helmet>
       <title> Mantenimientos </title>
      </Helmet>
      <Container>
        <Typography variant="h2" gutterBottom alignItems="left">
          Usuarios
        </Typography>
        <Typography variant="h2" gutterBottom alignItems="left">
          Generar código
        </Typography>
        <label>Rol del usuario a crear "Medico/Inventario/Admin"</label>
        <input style={{width:'200px'}} 
          onChange={({ target: { value } }) => {
            setRol(value)
          }}/>
        <button onClick={() => {
            handleAccesCode()
            
        }}>Generar código</button>
        {
            show ? (
            <Typography variant="h4" gutterBottom alignItems="left">
              {response.access_code}
          </Typography>) : null
        }
        <Typography variant="h2" gutterBottom alignItems="left">
          Editar usuarios
        </Typography>
        <div className='containerUser'>
          <InputAutoComplete name={'Nombre Usuario'} text={nameText} setText={(value) => handleGetOptionsPerson(value)} options={optionsToUsers} width={200}
          setKey={setKey}
          ></InputAutoComplete>
          <div>
            <h3>Dpi Usuario</h3>
            <input value={dpiText} onChange={(e) => setDpiText(e.target.value)} style={{width: '300px'}}></input>
          </div>
          {open ? (
            <>
            <div>
            <h3>Clave</h3>
            <input value={claveText} onChange={(e) => setClaveText(e.target.value)} style={{width: '300px'}}></input>
          </div>
          <div>
            <h3>Rol</h3>
            <SelectorDeOpciones setRespuesta={setRolText} respuesta={rolText}></SelectorDeOpciones>
          </div>
          <div>
            <button onClick={handleClickleable}>Enviar</button>
            </div>
            </>
          ):(<></>)

          }
          
          
        </div>
        
      </Container>
    </div>
  )
}
