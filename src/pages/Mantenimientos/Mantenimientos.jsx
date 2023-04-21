/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
/* eslint-disable react/react-in-jsx-scope */

import { Helmet } from 'react-helmet-async'
import { filter, set } from 'lodash'
import { sentenceCase } from 'change-case'
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

  const handleAccesCode = async () => {
    await handleRequest('POST', '/access_code', { role: rol }, auth.token)
  }

  useEffect(() => {
    console.log('accesCode', response)
  }, [response])

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
            setShow(true)
        }}>Generar código</button>
        {
            show ? (
            <Typography variant="h4" gutterBottom alignItems="left">
              {response.access_code}
          </Typography>) : null
        }
      </Container>
    </div>
  )
}
