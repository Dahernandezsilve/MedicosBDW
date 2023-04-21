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
import './TrasladarMedico.css'

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'unitHealthLast', label: 'Unidad de salud anterior', alignRight: false },
  { id: 'startDateL', label: 'Fecha de inicio', alignRight: false },
  { id: 'finalDateL', label: 'Fecha fin', alignRight: false },
]

// ----------------------------------------------------------------------

const ToAutocomplete = ({options, handleClickOptions, value, bollea}) => {
    return(
            <>
                {(options.length>0 && value.length<13) && bollea ?(
                    <ul className="containerTocomplete">
                        {options.slice(0, 5).map((op) =>(
                            <li className='containerTextComplete' onClick={()=>{handleClickOptions(op.value)}}>
                                <div className= 'textContainer'>
                                    {op.value +' ' +op.description}
                                </div>
    
                            </li>
                        ))
                        }
                    </ul>
                ):(
                    <></>
                )
                }
            </>
    
        )
    }
    
    const InputAutoComplete = ({text, setText, width, options, name}) =>{
        const [boolle, setBollea] = useState(true)
        const handleAction= (value) => {
            setText(value)
        }
    
    
      return(
          <div className='inputSpace' >
              <h3>{name + ' '}</h3>
              <input className='inputAutoCompleteP' style={{
                width: width+'px',
              }}
                     onChange={(e)=> {
                         setBollea(true)
                         setText(e.target.value)}}
                     value={text}
                     placeholder={name}
              >
              </input>
              <ToAutocomplete options={options} handleClickOptions={(value) => {
                  setBollea(false)
                  handleAction(value)}} value={text}
                bollea={boolle}
              ></ToAutocomplete>
          </div>
      )
    }

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1)
  }
  return stabilizedThis.map((el) => el[0])
}

export default function TrasladarMedico() {
  const { auth, setAuth } = useContext(AuthContex)

  const [response, loading, handleRequest] = useApi()

  const [dataUser, setDataUser] = useState({})

  const [expedienteS, setExpedienteS] = useState(false)

  const [id_patient, setIdPatient] = useState('')

  const [id_consult, setIdConsult] = useState('')

  const [id_insumo, setIdInsumo] = useState('')

  const [isNotFound, setIsNotFound] = useState(false)
  const [isNotFoundTratamient, setIsNotFoundTratamient] = useState(false)

  const [editar, setEditar] = useState(false)
  const [general, setGeneral] = useState(false)
  const [dataEdit, setDataEdit] = useState({})
  const [tratamientos, setTratamientos] = useState(false)
  const [eliminar, setEliminar] = useState(false)

  const [open, setOpen] = useState(null)

  const [dataHistorialActual, setDataHistorialActual] = useState({})
  const [dataHistorial, setDataHistorial] = useState([])

  const [dataTratamient, setDataTratamient] = useState([])
  const [dataEditTratamient, setDataEditTratamient] = useState({})
  const [editTratamient, setEditTratamient] = useState(false)

  const [page, setPage] = useState(0)

  const [selected, setSelected] = useState([])

  const [filterName, setFilterName] = useState('')

  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [docDpi, setDocDpi] = useState('')
  const [unitId, setUnitId] = useState('')
  const [optionsToUnitID, setOptionsToUnitID] = useState([])
  const [optionsToDPIDoctor, setOptionsToDPIDoctor] = useState([])

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpen(null)
  }

  const handleGetDoc = (value) => {
    console.log(value)
    const regex = /^\d+$/
    console.log(regex.test(value))
    if ((regex.test(value) || value === '') && value.length <= 13) {
      setDocDpi(value)
      handleRequest('POST', '/docInstant', { key: value }, auth.token)
    }
  }

  const handleGetUnit = (value) => {
    console.log(value)
    const regex = /^\d+$/
    console.log(regex.test(value))
    if ((regex.test(value) || value === '') && value.length <= 13) {
      setUnitId(value)
      handleRequest('POST', '/unitInstant', { key: value }, auth.token)
    }
  }

  useEffect((()=>{
    console.log(response)
    if (response.data !== undefined && response.data.length > 0) {
      if (response.type === 'Doctor') {
        setOptionsToUnitID([])
        setOptionsToDPIDoctor(response.data.map((paciente) => ({
          value: paciente.dpi,
          description: paciente.nameDoctor,
        })))
        if (docDpi === '') {
          setOptionsToDPIDoctor([])
        }
      } else if (response.type === 'Unit') {
        console.log(response.type)
        setOptionsToDPIDoctor([])
        setOptionsToUnitID(response.data.map((paciente) => ({
          value: paciente.dpi,
          description: paciente.nameUnit,
        })))
        console.log(optionsToUnitID)
        if (unitId === '') {
          setOptionsToUnitID([])
        }
      }
    }
    console.log(response)
  }), [response])

  const handleTrasladarMedico = async () => {
    await handleRequest('POST', '/editDoctorUnit', {
      dpiDoctor: docDpi,
      idUnit: unitId,
    }, auth.token)
  }

  const handleCloseGeneral = () => {
    setGeneral(false)
  }
  const handleOpenGeneral = () => {
    setGeneral(true)
  }

  const handleCloseEditTratamientos = () => {
    console.log('estado editar', editar)
    setEditTratamient(false)
  }

  const handleEditTratamientos = async () => {
    console.log('dataTratamient', dataTratamient)
    await handleRequest('POST', '/editTratamient', {
      idInsumo: id_insumo,
      dosis: dataEditTratamient.dose,
      fechaInicio: dataEditTratamient.startDate,
      fechaFinal: dataEditTratamient.finalDate,
      consulta: id_consult,
    }, auth.token)
  }

  const handleHistorial = async () => {
    // eslint-disable-next-line camelcase
    await handleRequest('POST', '/showUnitHealth', { dpiDoctor: docDpi }, auth.token)
  }

  useEffect(() => {
    if (response.data) {
      console.log('responseEffect', response)
      if (response.data.length > 0) {
        setDataHistorial(response.data)
        setDataHistorialActual(response)
        console.log('response46', response)
        if (response.data.length <= 0) {
          setIsNotFound(true)
        }
      }
    }
  }, [response])

  const handleEnter = async (event) => {
    if (event.keyCode === 13) {
      console.log('Se presionó Enter')
      await handleHistorial()
      setExpedienteS(true)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí puedes agregar tu lógica para enviar el formulario
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0

  return (
    <div>
      <Helmet>
        <title> Trasladar medico </title>
      </Helmet>
      <Container>
        <Typography variant="h2" gutterBottom alignItems="left">
          Trasladar médico:
        </Typography>
        <div
          onKeyUp={handleEnter}
          onChange={({ target: { value } }) => {
            setIdPatient(value)
          }}
        >
          <MenuItem onClick={() => {
            handleOpenGeneral()
            handleCloseMenu()
          }}
          >
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Trasladar un médico
          </MenuItem>
        </div>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Ver historial traslados
          </Typography>
          <div onKeyUp={handleEnter}>
            <InputAutoComplete name="DPI del médico para ver el historial" text={docDpi} setText={(value) => handleGetDoc(value)} options={optionsToDPIDoctor} width={250} onKeyUp={handleEnter} />
          </div>
        </Stack>
        {
          expedienteS ? (
            <Typography variant="h4" gutterBottom>
              Datos actuales del médico
              <Typography variant="h6" gutterBottom>
                Unidad de salud actual: {dataHistorialActual.actualUnit}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Fecha de inicio: {dataHistorialActual.dateStart}
              </Typography>
            </Typography>
          ) : null
        }
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                />
                <TableBody>
                  {dataHistorial.map((row) => {
                    const {
                      idUnit, startDate, finalDate,
                    } = row
                    return (
                      <TableRow hover key={idUnit} tabIndex={0}>
                        <TableCell style={{ fontSize: 10, paddingLeft: '16px' }} component="th" scope="row" padding="none">
                          <span>&nbsp;</span>{idUnit}
                        </TableCell>
                        <TableCell style={{ fontSize: 10 }} align="left">{startDate}</TableCell>
                        <TableCell style={{ fontSize: 10 }} align="left">{finalDate}</TableCell>
                      </TableRow>
                    )
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>
                              &quot;
                              {filterName}
                              &quot;
                            </strong>
                            .
                            <br />
                            {' '}
                            Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
      {general && (
      <Modal onClose={handleCloseGeneral}>
        <h2>Editar información general</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <InputAutoComplete name="DPI del médico" text={docDpi} setText={(value) => handleGetDoc(value)} options={optionsToDPIDoctor} width={500} />
          </div>
          <div className="form-row">
            <InputAutoComplete name="ID unidad de salud a trasladar" text={unitId} setText={(value) => handleGetUnit(value)} options={optionsToUnitID} width={500} />         </div>
          <button
            type="submit"
            onClick={() => {
              handleTrasladarMedico()
              handleCloseGeneral()
            }}> Enviar </button>
        </form>
      </Modal>
      )}
    </div>
  )
}
