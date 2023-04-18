/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable max-len */
/* eslint-disable react/react-in-jsx-scope */

import { Helmet } from 'react-helmet-async'
import { filter, set } from 'lodash'
import { sentenceCase } from 'change-case'
import { useContext, useState, useEffect } from 'react'
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
  const {auth, setAuth} = useContext(AuthContex)

  const [response, loading, handleRequest] = useApi()

  const [dataUser, setDataUser] = useState({})

  const [expedienteS, setExpedienteS] = useState(false)

  const [id_patient, setIdPatient] = useState('')

  const [id_consult, setIdConsult] = useState('')

  const [isNotFound, setIsNotFound] = useState(false)

  const [editar, setEditar] = useState(false)
  const [tratamientos, setTratamientos] = useState(false)
  const [eliminar, setEliminar] = useState(false)

  const [open, setOpen] = useState(null)

  const [dataExpedient, setDataExpedient] = useState([])

  const [page, setPage] = useState(0)

  const [order, setOrder] = useState('asc')

  const [selected, setSelected] = useState([])

  const [orderBy, setOrderBy] = useState('name')

  const [filterName, setFilterName] = useState('')

  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleOpenTratamientos = () => {
    setTratamientos(true)
  }

  const handleCloseTratamientos = () => {
    setTratamientos(false)
    console.log('estado tratamientos', tratamientos)
  }

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpen(null)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setPage(0)
    setRowsPerPage(parseInt(event.target.value, 10))
  }

  const handleFilterByName = (event) => {
    setPage(0)
    setFilterName(event.target.value)
  }



  const handleTratamient = async () => {
    handleRequest('POST', '/tratamient', { id_consult }, auth.token)
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
    if(response.data){
      if (response.data[0].addiction !== undefined) {
        setExpedienteS(true)
        console.log(response.data[0].name_patient)
        setDataUser(response.data[0])
        console.log('response45', response)
      } else {
          setDataExpedient(response.data)
          console.log('response46', response)
        if(response.data.length<=0) {
          setIsNotFound(true)
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0

  return (
    <div>
      <Helmet>
        <title> Expediente </title>
      </Helmet>
      <Container>
        <Typography variant="h2" gutterBottom alignItems='left'>
          Expediente:
        </Typography>
        <div onKeyUp={handleEnter} 
             onChange={({ target: { value } }) => {
             setIdPatient(value)
            }}>
          <UserListToolbar />
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
                  Teléfono: {dataUser.address}
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
                  Peso: {dataUser.weight}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Altura: {dataUser.height}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Enfermedad hereditaria: {dataUser.hereditary_disease}
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
                      evolution, healthUnit, id, nameDoctor
                    } = row
                    const selectedUser = selected.indexOf(id) !== -1

                    return (
                      <TableRow hover key={id} tabIndex={0}>
                        <TableCell style={{ fontSize: 10 }} component="th" scope="row" padding="none">
                          {date}
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
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
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

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
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
        <MenuItem onClick={()=> {
          setEditar(true)
          console.log('edit', editar)}}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={() => {
          setIdConsult(id)
          handleOpenTratamientos()
        }}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Ver tratamientos
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
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                />
                <TableBody>
                  {dataExpedient.map((row) => {
                    const {
                      date, description, disease,
                      evolution, healthUnit, id, nameDoctor
                    } = row
                    const selectedUser = selected.indexOf(id) !== -1

                    return (
                      <TableRow hover key={id} tabIndex={0}>
                        <TableCell style={{ fontSize: 10 }} component="th" scope="row" padding="none">
                          {date}
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
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
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
              <button onClick={handleCloseTratamientos}>Cerrar</button>
            </Modal>
          )}
    </div>
  )
}
