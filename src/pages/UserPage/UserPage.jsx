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
import './UserPage.css'

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
// ----------------------------------------------------------------------

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

export default function UserPage() {
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

  const [dataExpedient, setDataExpedient] = useState([])

  const [dataTratamient, setDataTratamient] = useState([])
  const [dataEditTratamient, setDataEditTratamient] = useState({})
  const [editTratamient, setEditTratamient] = useState(false)

  const [page, setPage] = useState(0)

  const [selected, setSelected] = useState([])

  const [filterName, setFilterName] = useState('')

  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpen(null)
  }

  const handleCloseTratamientos = () => {
    setTratamientos(false)
  }

  const handleTratamient = async () => {
    handleRequest('POST', '/tratamient', { id_consult }, auth.token)
  }

  const handleOpenTratamientos = async () => {
    await handleTratamient()
    console.log('estado tratamientos', tratamientos)
    setTratamientos(true)
  }

  const handleCloseEditar = () => {
    setEditar(false)
  }

  const handleEditar = async () => {
    console.log('Consulta', id_consult)
    console.log('Paciente', id_patient)
    console.log('dataEdit', dataEdit)
    await handleRequest('POST', '/editConsult', {
      date: dataEdit.date,
      nameDoctor: dataEdit.nameDoctor,
      evolution: dataEdit.evolution,
      description: dataEdit.description,
      disease: dataEdit.disease,
      healthUnit: dataEdit.healthUnit,
      id_consult,
      id_patient,
    }, auth.token)
  }

  const handleGeneral = async () => {
    console.log('dataUser', dataUser)
    await handleRequest('POST', '/editPatient', {
      nombre: dataUser.name_patient,
      direccion: dataUser.address,
      telefono: dataUser.numberTel,
      fecha_nacimiento: dataUser.birthdate,
      genero: dataUser.genre,
      adicciones: dataUser.addiction,
      fecha_inicio: dataUser.start_date,
      indice_masa_corporal: dataUser.corporal_mass,
      peso: dataUser.weight,
      altura: dataUser.height,
      enfermedad_hereditaria: dataUser.hereditary_disease,
      status: dataUser.status,
      dpi: id_patient,
    }, auth.token)
  }

  const handleCloseGeneral = () => {
    setGeneral(false)
  }
  const handleOpenGeneral = () => {
    setGeneral(true)
  }

  const handleOpenEditTratamientos = () => {
    console.log('estado editar', editar)
    setEditTratamient(true)
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

  const handleOpenEditar = () => {
    console.log('estado editar', editar)
    setEditar(true)
  }

  const handleGetPaciente = async () => {
    // eslint-disable-next-line camelcase
    await handleRequest('POST', '/patients', { id_patient }, auth.token)
  }

  const handleExpediente = async () => {
    // eslint-disable-next-line camelcase
    await handleRequest('POST', '/expedient', { id_patient }, auth.token)
  }

  useEffect(() => {
    if (response.data) {
      console.log('responseEffect', response)
      if (response.data.length > 0) {
        if (response.data[0].addiction !== undefined && response.data[0].addiction !== null) {
          setExpedienteS(true)
          console.log(response.data[0].name_patient)
          setDataUser(response.data[0])
          console.log('response45', response)
        } else if (response.data[0].dose !== undefined && response.data[0].dose !== null) {
          setDataTratamient(response.data)
          console.log('response93', response)
          if (response.data.length <= 0) {
            setIsNotFoundTratamient(true)
          }
        } else {
          setDataExpedient(response.data)
          console.log('response46', response)
          if (response.data.length <= 0) {
            setIsNotFound(true)
          }
        }
      }
    }
  }, [response])

  const handleEnter = async (event) => {
    if (event.keyCode === 13) {
      console.log('Se presionó Enter')
      await handleGetPaciente()
      await handleExpediente()
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
        <title> Expediente </title>
      </Helmet>
      <Container>
        <Typography variant="h2" gutterBottom alignItems="left">
          Expediente:
        </Typography>
        <div
          onKeyUp={handleEnter}
          onChange={({ target: { value } }) => {
            setIdPatient(value)
          }}
        >
          <UserListToolbar />
          <MenuItem onClick={() => {
            handleOpenGeneral()
            handleCloseMenu()
          }}
          >
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Editar
          </MenuItem>
        </div>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          {
          expedienteS ? (
            <>
              <Typography variant="h4" gutterBottom>
                Datos generales
                <Typography variant="h6" gutterBottom>
                  Nombre: {dataUser.name_patient}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Dirección: {dataUser.address}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Teléfono: {dataUser.numberTel}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Fecha de nacimiento: {dataUser.birthdate}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Género: {dataUser.genre}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Adicciones: {dataUser.addiction}
                </Typography>
              </Typography>
              <Typography variant="h4" gutterBottom>
                Estado actual {dataUser.status}
                <Typography variant="h6" gutterBottom>
                  Fecha inicio: {dataUser.start_date}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Indice de masa corporal: {dataUser.corporal_mass}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Peso: {dataUser.weight} lb
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Altura: {dataUser.height} m
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Enfermedad hereditaria: {dataUser.hereditary_disease === false ? 'No padece' : 'Sí padece'}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Estado: {dataUser.status}
                </Typography>
              </Typography>
            </>
          ) : (
            <Typography variant="h4" gutterBottom>
              Datos generales
            </Typography>
          )
            }
        </Stack>
        <Typography variant="h3" gutterBottom>
          Consultas
        </Typography>
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
                  {dataExpedient.map((row) => {
                    const {
                      date, description, disease,
                      evolution, healthUnit, id, nameDoctor,
                    } = row

                    return (
                      <TableRow hover key={id} tabIndex={0}>
                        <TableCell style={{ fontSize: 10, paddingLeft: '16px' }} component="th" scope="row" padding="none">
                          <span>&nbsp;</span>{date}
                        </TableCell>

                        <TableCell style={{ fontSize: 10 }} align="left">{nameDoctor}</TableCell>

                        <TableCell style={{ fontSize: 10 }} align="left">{description}</TableCell>

                        <TableCell style={{ fontSize: 10 }} align="left">{evolution}
                        </TableCell>

                        <TableCell style={{ fontSize: 10 }} align="left">
                          {healthUnit}
                        </TableCell>

                        <TableCell style={{ fontSize: 10 }} align="right">{disease}</TableCell>

                        <TableCell style={{ fontSize: 10 }} align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(event) => {
                              setIdConsult(id)
                              setDataEdit(row)
                              console.log('dataEdit', dataEdit)
                              handleOpenMenu(event)
                              console.log(id)
                            }}
                          >
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
                        </TableCell>
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

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => {
          handleOpenEditar()
          handleCloseMenu()
        }}
        >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={() => {
          handleOpenTratamientos()
          handleCloseMenu()
        }}
        >
          <img src="../../../src/assets/eye.svg" alt="Ministerio de salud" />
          <span>&nbsp;</span>Ver tratamientos
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
      {tratamientos && (
      <Modal onClose={handleCloseTratamientos}>
        <h2>Tratamientos</h2>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <UserListHead
              headLabel={tableTratamientos}
              rowCount={USERLIST.length}
              numSelected={selected.length}
            />
            <TableBody>
              {dataTratamient.map((row) => {
                const {
                  dose,
                  finalDate,
                  inputDescription,
                  startDate,
                  id,
                } = row
                // eslint-disable-next-line no-unused-expressions
                return (
                  <TableRow hover key={dose} tabIndex={0}>
                    <TableCell style={{ fontSize: 10, paddingLeft: '16px' }} component="th" scope="row" padding="none">
                      {inputDescription}
                    </TableCell>

                    <TableCell style={{ fontSize: 10 }} align="left">{dose}</TableCell>

                    <TableCell style={{ fontSize: 10 }} align="left">
                      {startDate}
                    </TableCell>

                    <TableCell style={{ fontSize: 10 }} align="left">{finalDate}
                    </TableCell>

                    <TableCell style={{ fontSize: 10 }} align="right">
                      <MenuItem onClick={() => {
                        setIdInsumo(id)
                        setDataEditTratamient(row)
                        handleOpenEditTratamientos()
                      }}
                      >
                        <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                        Editar
                      </MenuItem>
                    </TableCell>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
              )}
            </TableBody>

            {isNotFoundTratamient && (
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
        <button onClick={handleCloseTratamientos} type="button">Cerrar</button>
      </Modal>
      )}
      {editar && (
      <Modal onClose={handleCloseEditar}>
        <h2>Editar consulta</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-column">
              <label>Fecha</label>
              <input
                type="text"
                id="date"
                value={dataEdit.date}
                onChange={(e) => setDataEdit({ ...dataEdit, date: e.target.value })}
              />
            </div>
            <div className="form-column">
              <label>Doctor</label>
              <input
                type="text"
                id="nameDoctor"
                value={dataEdit.nameDoctor}
                onChange={(e) => setDataEdit({ ...dataEdit, nameDoctor: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-column">
              <label>Descripción</label>
              <input
                id="description"
                value={dataEdit.description}
                onChange={(e) => setDataEdit({ ...dataEdit, description: e.target.value })}
              />
            </div>
            <div className="form-column">
              <label>Evolución</label>
              <input
                type="text"
                id="evolution"
                value={dataEdit.evolution}
                onChange={(e) => setDataEdit({ ...dataEdit, evolution: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-column">
              <label>Unidad de salud</label>
              <input
                type="text"
                id="healthUnit"
                value={dataEdit.healthUnit}
                onChange={(e) => setDataEdit({ ...dataEdit, healthUnit: e.target.value })}
              />
            </div>
            <div className="form-column">
              <label>Enfermedad</label>
              <input
                type="text"
                id="disease"
                value={dataEdit.disease}
                onChange={(e) => setDataEdit({ ...dataEdit, disease: e.target.value })}
              />
            </div>
          </div>
          <button
            type="submit"
            onClick={() => {
              handleEditar()
              handleCloseEditar()
            }}>Enviar</button>
        </form>
      </Modal>
      )}
      {general && (
      <Modal onClose={handleCloseGeneral}>
        <h2>Editar información general</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-column">
              <label>Nombre</label>
              <input
                type="text"
                id="date"
                value={dataUser.name_patient}
                onChange={(e) => setDataUser({ ...dataUser, name_patient: e.target.value })}
              />
            </div>
            <div className="form-column">
              <label>Fecha inicio</label>
              <input
                type="text"
                id="nameDoctor"
                value={dataUser.start_date}
                onChange={(e) => setDataUser({ ...dataUser, startDate: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-column">
              <label>Dirección</label>
              <input
                id="description"
                value={dataUser.address}
                onChange={(e) => setDataUser({ ...dataUser, address: e.target.value })}
              />
            </div>
            <div className="form-column">
              <label>Índice de masa corporal</label>
              <input
                type="text"
                id="evolution"
                value={dataUser.corporal_mass}
                onChange={(e) => setDataUser({ ...dataUser, corporal_mass: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-column">
              <label>Teléfono</label>
              <input
                type="text"
                id="healthUnit"
                value={dataUser.numberTel}
                onChange={(e) => setDataUser({ ...dataUser, numberTel: e.target.value })}
              />
            </div>
            <div className="form-column">
              <label>Peso</label>
              <input
                type="text"
                id="disease"
                value={dataUser.weight}
                onChange={(e) => setDataUser({ ...dataUser, weight: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-column">
              <label>Fecha de nacimiento</label>
              <input
                type="text"
                id="healthUnit"
                value={dataUser.birthdate}
                onChange={(e) => setDataUser({ ...dataUser, birthdate: e.target.value })}
              />
            </div>
            <div className="form-column">
              <label>Altura</label>
              <input
                type="text"
                id="disease"
                value={dataUser.height}
                onChange={(e) => setDataUser({ ...dataUser, height: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-column">
              <label>Genero</label>
              <input
                type="text"
                id="healthUnit"
                value={dataUser.genre}
                onChange={(e) => setDataUser({ ...dataUser, genre: e.target.value })}
              />
            </div>
            <div className="form-column">
              <label>Adicciones</label>
              <input
                type="text"
                id="healthUnit"
                value={dataUser.addiction}
                onChange={(e) => setDataUser({ ...dataUser, addiction: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-column">
              <label>Estado</label>
              <input
                type="text"
                id="disease"
                value={dataUser.status}
                onChange={(e) => setDataUser({ ...dataUser, status: e.target.value })}
              />
            </div>
          </div>
          <button
            type="submit"
            onClick={() => {
              handleGeneral()
              handleCloseGeneral()
            }}>Enviar</button>
        </form>
      </Modal>
      )}
      {editTratamient && (
      <Modal onClose={handleCloseEditTratamientos}>
        <h2>Editar tratamiento</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Dosis a modificar</label>
            <input
              type="text"
              id="date"
              value={dataEditTratamient.dose}
              onChange={(e) => setDataEditTratamient({ ...dataEditTratamient, dose: e.target.value })} />
          </div>
          <div className="form-row">
            <label>Fecha finalización de tratamiento </label>
            <input
              type="text"
              id="date"
              value={dataEditTratamient.finalDate}
              onChange={(e) => setDataEditTratamient({ ...dataEditTratamient, finalDate: e.target.value })} />
          </div>
          <button
            type="submit"
            onClick={() => {
              handleEditTratamientos()
              handleCloseEditTratamientos()
            }}>Enviar</button>
        </form>
      </Modal>
      )}
    </div>
  )
}
