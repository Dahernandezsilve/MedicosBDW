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
import Modal from '../../components/Modal/Modal'
import BotonSeleccionable from '../../components/BotonSeleccionable/BotonSeleccionable'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: ' ' },
  { id: 'insumo', label: 'Insumo', alignRight: false },
  { id: 'company', label: 'Cantidad', alignRight: false },
  { id: 'unitHealth', label: 'Unidad de salud', alignRight: false },
  { id: ' ' },
]

const expiredList = [
  { id: ' ' },
  { id: 'insumo', label: 'Insumo', alignRight: false },
  { id: 'company', label: 'Cantidad', alignRight: false },
  { id: 'unitHealth', label: 'Unidad de salud', alignRight: false },
  { id: 'expireDate', label: 'Fecha de expiración', alignRight: false },
  { id: ' ' },
]

// ----------------------------------------------------------------------

const DateInput = ({name, date, setDate}) => {

  const handleChange = event => {
      const inputDate = event.target.value
      const formattedDate = formatDate(inputDate)
      setDate(formattedDate)
  };

  const formatDate = dateString => {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = zeroPad(date.getMonth() + 1)
      const day = zeroPad(date.getDate())
      const hours = zeroPad(date.getHours())
      const minutes = zeroPad(date.getMinutes())
      const seconds = zeroPad(date.getSeconds())
      const milliseconds = zeroPad(date.getMilliseconds(), 3)
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
  };

  const zeroPad = (number, width = 2) => {
      return String(number).padStart(width, '0')
  };

  return (
      <div>
          <h3>{name + ' '}</h3>
          <input type="datetime-local" value={date} onChange={handleChange} />
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

export default function EstadoInventario(effect, deps) {
  const { auth, setAuth } = useContext(AuthContex)

  const [response, loading, handleRequest] = useApi()

  const [dataDisea, setDataDisea] = useState([])

  const [dataExpire, setDataExpire] = useState([])

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

  const [solicitar, setSolicitar] = useState(false)
  const [solicitarExpired, setSolicitarExpired] = useState(false)

  const [cantidad, setCantidad] = useState('')
  const [fechaVencimiento, setFechaVencimiento] = useState('')
  const [dataAgotar, setDataAgotar] = useState({})
  const [dataExpired, setDataExpired] = useState({})
  const [dateStart, setDateStar] = useState('')
  
  const handleOpenSolicitar = () => {
    setSolicitar(true)
  }

  const handleCloseSolicitar = () => {
    setSolicitar(false)
  }

  const handleOpenSolicitarExpired = () => {
    setSolicitarExpired(true)
  }

  const handleCloseSolicitarExpired = () => {
    setSolicitarExpired(false)
  }

  const handleAgotar = async () => {
    await handleRequest('POST', '/requestProduct', {
      idProduct: dataAgotar.productId,
      idUnit: dataAgotar.unitId,
      count: cantidad,
      expiredDate: fechaVencimiento,
    }, auth.token)
  }

  const handleSolicitarExpired = async () => {
    await handleRequest('POST', '/requestProductExpired', {
      idProduct: dataExpired.productId,
      idUnit: dataExpired.unitID,
      count: cantidad,
      expiredDate: fechaVencimiento,
      oldExpiredDate: dataExpired.expiredDate,
    }, auth.token)
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

  const handleInventory = async () => {
    // eslint-disable-next-line camelcase
    await handleRequest('GET', '/verifyInventory', '', auth.token)
  }

  const handleExpired = async () => {
    // eslint-disable-next-line camelcase
    await handleRequest('GET', '/verifyExpired', '', auth.token)
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
      }
      console.log('respuestaGeneral', response.data)
    }
  }, [response.data])

  return (
    <>
      <Helmet>
        <title> Estado del inventario </title>
      </Helmet>
      <Container>
        <Typography variant="h2" gutterBottom alignItems="left">
          Estado del inventario
        </Typography>
        <BotonSeleccionable activeIndex={activeIndex} handleButtonClick={handleButtonClick} indicador1={dataDisea.length} indicador2={dataExpire.length} />
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
                        availableQuantity,
                        healthUnit,
                        product,
                        expiredDate,
                        productId,
                        unitID,
                      } = row

                      return (
                        <TableRow hover key={healthUnit} tabIndex={-1} role="checkbox" selected={healthUnit}>

                          <TableCell align="left">  </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {product}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{availableQuantity}</TableCell>

                          <TableCell align="left">{healthUnit}</TableCell>

                          <TableCell align="left">{expiredDate}</TableCell>

                          <TableCell style={{ fontSize: 10 }} align="right">
                            <MenuItem onClick={() => {
                              setDataExpired(row)
                              handleOpenSolicitarExpired()
                            }}
                            >
                            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                              Solicitar
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
        ) : null}
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
                          productId,
                          healthUnit,
                          product,
                          availableQuantity,
                          unitId,
                        } = row

                        return (
                          <TableRow hover key={healthUnit} tabIndex={-1} role="checkbox" selected={healthUnit}>

                            <TableCell align="left">  </TableCell>

                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" noWrap>
                                  {product}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">{availableQuantity}</TableCell>

                            <TableCell align="left">{healthUnit}</TableCell>

                            <TableCell style={{ fontSize: 10 }} align="right">
                              <MenuItem onClick={() => {
                                setDataAgotar(row)
                                handleOpenSolicitar()
                              }}
                              >
                                <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                                Solicitar
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
          ) : null
        }
        {solicitar && (
        <Modal onClose={handleCloseSolicitar}>
          <h2>Solicitar medicamento</h2>
          <div className="form-row">
            <div className="form-column">
              <label>Cantidad a solicitar</label>
              <input
                type="text"
                id="date"
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>
            <div className="form-column">
              <DateInput name={'Fecha de vencimiento'} date={fechaVencimiento} setDate={(value) => setFechaVencimiento(value)} />
            </div>
          </div>
          <button
            type="submit"
            onClick={() => {
              handleAgotar()
              handleCloseSolicitar()
            }}> Solicitar </button>
        </Modal>
        )}
        {solicitarExpired && (
        <Modal onClose={handleCloseSolicitarExpired}>
          <h2>Solicitar medicamento</h2>
          <div className="form-row">
            <div className="form-column">
              <label>Cantidad a solicitar</label>
              <input
                type="text"
                id="date"
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>
            <div className="form-column">
              <DateInput name={'Fecha de vencimiento'} date={fechaVencimiento} setDate={(value) => setFechaVencimiento(value)} />
            </div>
          </div>
          <button
            type="submit"
            onClick={() => {
              handleSolicitarExpired()
              handleCloseSolicitarExpired()
            }}> Solicitar </button>
        </Modal>
        )}
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
