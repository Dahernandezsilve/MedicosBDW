/* eslint-disable max-len */
/* eslint-disable react/react-in-jsx-scope */

import { Helmet } from 'react-helmet-async'
import { filter, set } from 'lodash'
import { sentenceCase } from 'change-case'
import { useContext, useEffect, useState } from 'react'
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
import { UserListHead } from '../../sections/@dashboard/user'
// mock
import USERLIST from '../../_mock/user'
import useApi from '../../../hooks/useApi/useApi'
import { AuthContex } from '../../App'
import BotonSeleccionableTriple from '../../components/BotonSeleccionableTriple/BotonSeleccionableTriple'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: ' ' },
  { id: 'ranking', label: 'Ranking', alignRight: false },
  { id: 'namePatient', label: 'Nombre del paciente', alignRight: false },
  { id: 'dpi', label: 'DPI', alignRight: false },
  { id: 'asistencias', label: 'Cantidad de asistencias', alignRight: false },
]

const expiredList = [
  { id: ' ' },
  { id: 'ranking', label: 'Ranking', alignRight: false },
  { id: 'nameDoctor', label: 'Nombre del doctor', alignRight: false },
  { id: 'dpi', label: 'DPI', alignRight: false },
  { id: 'countAttendedPatient', label: 'Cantidad de pacientes atendidos', alignRight: false },
]

const unitHealthList = [
  { id: ' ' },
  { id: 'ranking', label: 'Ranking', alignRight: false },
  { id: 'nameUnit', label: 'Nombre de la unidad', alignRight: false },
  { id: 'idUnit', label: 'Id de la unidad', alignRight: false },
  { id: 'countP', label: 'Cantidad de pacientes atendidos', alignRight: false },
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

export default function EstadisticasAdmin(effect, deps) {
  const { auth, setAuth } = useContext(AuthContex)

  const [response, loading, handleRequest] = useApi()

  const [dataDisea, setDataDisea] = useState([])

  const [dataExpire, setDataExpire] = useState([])

  const [dataUnitHealth, setDataUnitHealth] = useState([])

  const [isNotFound, setIsNotFound] = useState(false)

  const [open, setOpen] = useState(null)

  const [page, setPage] = useState(0)

  const [order, setOrder] = useState('asc')

  const [selected, setSelected] = useState([])

  const [orderBy, setOrderBy] = useState('name')

  const [filterName] = useState('')

  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Botones seleccionables

  const [activeIndex, setActiveIndex] = useState(0)

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

  const handleInventory = async () => {
    // eslint-disable-next-line camelcase
    await handleRequest('GET', '/topPatient', '', auth.token)
  }

  const handleUnitHealth = async () => {
    // eslint-disable-next-line camelcase
    await handleRequest('GET', '/topUnitHealth', '', auth.token)
  }

  const handleExpired = async () => {
    // eslint-disable-next-line camelcase
    await handleRequest('GET', '/topDoc', '', auth.token)
    console.log('dataDoctor', dataExpire)
  }

  const handleButtonClick = (index) => {
    setActiveIndex(index)
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0

  useEffect(() => {
    handleInventory()
  }, [])

  useEffect(() => {
    if (activeIndex === 0) {
      handleInventory()
      console.log('respuestaInventory', response.data)
    }
    if (activeIndex === 1) {
      handleExpired()
      console.log('respuestaExpired', response.data)
    }
    if (activeIndex === 2) {
      handleUnitHealth()
      console.log('respuestaUnitHealth', response.data)
    }
  }, [activeIndex])

  useEffect(() => {
    if (response.data !== undefined && response.data !== null) {
      if (response.data.length <= 0) {
        setIsNotFound(true)
      }
      if (activeIndex === 0) {
        setDataDisea(response.data)
      } else if (activeIndex === 1) {
        setDataExpire(response.data)
      } else if (activeIndex === 2) {
        setDataUnitHealth(response.data)
      }
      console.log('respuestaGeneral', response.data)
    }
  }, [response.data])

  return (
    <>
      <Helmet>
        <title> Estadísticas </title>
      </Helmet>
      <Container>
        <Typography variant="h2" gutterBottom alignItems="left">
          Estadísticas
        </Typography>
        <BotonSeleccionableTriple activeIndex={activeIndex} handleButtonClick={handleButtonClick} />
        { activeIndex === 1 ? (
          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={expiredList}
                    rowCount={USERLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {dataExpire.map((row) => {
                      const {
                        ranking,
                        countAttendedPatient,
                        nameDoctor,
                        dpiDoctor,
                      } = row

                      return (
                        <TableRow hover key={nameDoctor} tabIndex={-1} role="checkbox" selected={nameDoctor}>

                          <TableCell align="left">  </TableCell>

                          <TableCell align="left">{ranking}</TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {nameDoctor}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{dpiDoctor}</TableCell>

                          <TableCell align="left">{countAttendedPatient}</TableCell>
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
        ) : ''}
        {
          activeIndex === 0 ? (
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
                      {dataDisea.map((row) => {
                        const {
                          ranking,
                          count,
                          dpiPatient,
                          namePatient,
                        } = row

                        return (
                          <TableRow hover key={ranking} tabIndex={-1} role="checkbox" selected={ranking}>

                            <TableCell align="left">  </TableCell>

                            <TableCell align="left">{ranking}</TableCell>

                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" noWrap>
                                  {namePatient}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">{dpiPatient}</TableCell>

                            <TableCell align="left">{count}</TableCell>

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
          ) : ('')
        }
        { activeIndex === 2 ? (
          <Card>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={unitHealthList}
                    rowCount={USERLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {dataUnitHealth.map((row) => {
                      const {
                        ranking,
                        idUnit,
                        nameUnit,
                        countP,
                      } = row

                      return (
                        <TableRow hover key={ranking} tabIndex={-1} role="checkbox" selected={ranking}>

                          <TableCell align="left">  </TableCell>

                          <TableCell align="left">{ranking}</TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {nameUnit}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{idUnit}</TableCell>

                          <TableCell align="left">{countP}</TableCell>
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
        ) : ''}
  
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
