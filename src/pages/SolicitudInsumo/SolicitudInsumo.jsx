/* eslint-disable react/function-component-definition */
/* eslint-disable max-len */
/* eslint-disable react/react-in-jsx-scope */

import { Helmet } from 'react-helmet-async'
import { filter, set } from 'lodash'
import { sentenceCase } from 'change-case'
import {useContext, useEffect, useState} from 'react'
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
import './SolicitudInsumo.css'
import {value} from "lodash/seq.js";

// ----------------------------------------------------------------------

const DateInput = ({name, date, setDate}) => {
  const handleChange = event => {
    const inputDate = event.target.value
    const formattedDate = formatDate(inputDate)
    setDate(formattedDate)
  }

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
  }

  const zeroPad = (number, width = 2) => {
    return String(number).padStart(width, '0')
  }
  return (
    <div>
        <h3>{name + ' '}</h3>
        <input type="datetime-local" value={date} onChange={handleChange} />
    </div>
  )
}

const ButtonRadius = ({text, accion}) => (
  <button
    type="button"
    style={{
      borderRadius: '8px',
      color: 'white',
      outline: 'none',
      width: '100px',
      height: '30px',
      fontSize: '8px',
      fontWeight: 'bold',
    }}
    onClick={accion}
  >
    {text}
  </button>
)

const CellToComplete = ({text, dpi, action})=> (
  <li className='optionComplete' >
    <span>{dpi}</span> <span>{text}</span>
  </li>
)

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

export default function SolicitudInsumo() {
  const {auth, setAuth} = useContext(AuthContex)
  const [response, loading, handleRequest] = useApi()
  const [dateStart, setDateStart] = useState('')

  const [unitId, setUnitId] = useState('')
  const [insumoId, setInsumoId] = useState('')
  const [optionsToUnitID, setOptionsToUnitID] = useState([])
  const [optionsToInsumoID, setOptionsToInsumoID] = useState([])
  const [cantidad, setCantidad] = useState('')

  const handleGetUnit = (value) => {
    console.log(value)
    const regex = /^\d+$/
    console.log(regex.test(value))
    if ((regex.test(value) || value === '') && value.length <= 13) {
      setUnitId(value)
      handleRequest('POST', '/unitInstant', { key: value }, auth.token)
    }
  }

  const handleGetInsumo = (value) => {
    console.log(value)
    const regex = /^\d+$/
    console.log(regex.test(value))
    if ((regex.test(value) || value === '') && value.length <= 13) {
      setInsumoId(value)
      handleRequest('POST', '/productInstant', { key: value }, auth.token)
    }
  }

  

  useEffect(() => {
    console.log(response)
    if (response.data !== undefined && response.data.length > 0) {
      if (response.type === 'Unit') {
        console.log(response.type)
        setOptionsToInsumoID([])
        setOptionsToUnitID(response.data.map((paciente) => ({
          value: paciente.dpi,
          description: paciente.nameUnit,
        })))
        console.log(optionsToUnitID)
        if (unitId === '') {
          setOptionsToUnitID([])
        }
      } else if (response.type === 'Product') {
        console.log(response.type)
        setOptionsToUnitID([])
        setOptionsToInsumoID(response.data.map((paciente) => ({
          value: paciente.dpi,
          description: paciente.nameProduct,
        })))
        console.log(optionsToInsumoID)
        if (insumoId === '') {
          setOptionsToInsumoID([])
        }
      }
      console.log(response)
    }
  }, [response])

  useEffect(() => {
    console.log(dateStart)
  }, [dateStart])

  const handleRetirar = async () => {
    await handleRequest('POST', '/solicitar', {
      idProduct: unitId,
      idUnit: insumoId,
      count: cantidad,
    }, auth.token)
  }

  return (
    <div>
      <h1>Retirar insumo</h1>
      <div className='contenedorConsulta' >
        <InputAutoComplete name={'ID Unidad de salud'} text={unitId} setText={(value) => handleGetUnit(value)} options={optionsToUnitID} width={250} />
        <InputAutoComplete name={'ID de insumo'} text={insumoId} setText={(value) => handleGetInsumo(value)} options={optionsToInsumoID} width={250} />
        <div className="form-row">
          <div className="form-column">
            <label>Cantidad a retirar</label>
            <input
              type="text"
              id="date"
              onChange={(e) => setCantidad(e.target.value)}
            />
            <button
              type="submit"
              onClick={() => {
                handleRetirar()
              }}> Retirar </button>
          </div>
        </div>
      </div>
    </div>
  )
}
