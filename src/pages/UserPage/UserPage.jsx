/* eslint-disable react/react-in-jsx-scope */

import { Helmet } from 'react-helmet-async'
import { filter, set } from 'lodash'
import { sentenceCase } from 'change-case'
import { useContext, useState } from 'react'
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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
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

  const [expedienteS, setExpedienteS] = useState(false)

  const [id_patient, setIdPatient] = useState('')

  const [open, setOpen] = useState(null)

  const [page, setPage] = useState(0)

  const [order, setOrder] = useState('asc')

  const [selected, setSelected] = useState([])

  const [orderBy, setOrderBy] = useState('name')

  const [filterName, setFilterName] = useState('')

  const [rowsPerPage, setRowsPerPage] = useState(5)

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



  const handleLogin = async () => {
    handleRequest('POST', '/login', { dpi: 'Master', clave: '0000' })
  }

  const handleGetPaciente = async () => {
    // eslint-disable-next-line camelcase
    handleRequest('POST', '/patients', { id_patient }, auth.token)
    
  }

  const handleExpediente = async () => {
    // eslint-disable-next-line camelcase
    await handleRequest('POST', '/expedient', { id_patient }, auth.token)
  }

  const handleEnter = (event) => {
    if (event.keyCode === 13) {
      console.log('Se presionó Enter')
      handleGetPaciente()
      if (response.data[0] !== undefined){
        setExpedienteS(true)
        console.log(response.data[0].name_patient)
      }

    }
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName)

  const isNotFound = !filteredUsers.length && !!filterName

  return (
    <>
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
            <Typography variant="h6" gutterBottom>
              Nombre:  {response.data[0].name_patient}
            </Typography>
          ) : (
            <>
              <Typography variant="h4" gutterBottom>
                Datos generales
                <Typography variant="h6" gutterBottom>
                  Nombre:
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Dirección:
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Teléfono:
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Fecha de nacimiento:
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Género:
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Adicciones:
                </Typography>
              </Typography>
              <Typography variant="h4" gutterBottom>
                Estado actual
                <Typography variant="h6" gutterBottom>
                  Fecha inicio:
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Indice de masa corporal:
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Peso:
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Altura:
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Enfermedad hereditaria:
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Estado:
                </Typography>
              </Typography>
            </>
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
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const {
                      id, name, role, status, company, avatarUrl, isVerified,
                    } = row
                    const selectedUser = selected.indexOf(name) !== -1

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={name} src={avatarUrl} />
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{company}</TableCell>

                        <TableCell align="left">{role}</TableCell>

                        <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>

                        <TableCell align="left">
                          <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                        </TableCell>

                        <TableCell align="right">
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
        <MenuItem>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  ) 
}
