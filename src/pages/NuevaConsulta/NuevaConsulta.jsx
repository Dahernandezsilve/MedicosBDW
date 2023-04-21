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
import './NuevaConsulta.css'
import {value} from "lodash/seq.js";

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


const ButtonRadius = ({text, accion}) =>{

  return(
      <button style={{
        borderRadius: '8px',
        color: 'white',
        outline: 'none',
        width: '100px',
        height: '30px',
        fontSize: '8px',
        fontWeight: 'bold'
      }}

      onClick={accion}>
        {text}
      </button>
  )
}

const CellToComplete = ({text, dpi, action})=>{
    return(
        <li className='optionComplete' >
            <span>{dpi}</span> <span>{text}</span>
        </li>
    )

}

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

export default function NuevaConsulta() {
  const {auth, setAuth} = useContext(AuthContex)
  const [patientDpi, setPatientDpi] = useState('')
  const [diseaseId, setDiseaseId] = useState('')
  const [docDpi, setDocDpi] = useState('')
  const [response, loading, handleRequest] = useApi()
  const [optionsToDPIPatient, setOptionsToDPIPatient] = useState([])
  const [optionsToDPIDoctor, setOptionsToDPIDoctor] = useState([])
  const [optionsToIdDisease, setOptionsToIdDisease] = useState([])
  const [dateStart, setDateStart] = useState('')

  const handleGetPatients = (value) => {
    console.log(value)
    const regex = /^\d+$/
    console.log(regex.test(value))
    if ((regex.test(value) || value === '') && value.length <= 13) {
      setPatientDpi(value)
      handleRequest('POST', '/patientInstant',{id_patient: value}, auth.token)
    }
  }

  const handleGetDoc = (value) => {
    console.log(value)
    const regex = /^\d+$/
    console.log(regex.test(value))
    if ((regex.test(value) || value === '') && value.length <= 13) {
      setDocDpi(value)
      handleRequest('POST', '/docInstant',{id_patient: value}, auth.token)
    }
  }

  const handleGetDisease = (value) => {
    console.log(value)
    const regex = /^\d+$/
    console.log(regex.test(value))
    if ((regex.test(value) || value === '') && value.length <= 13) {
      setDiseaseId(value)
      handleRequest('POST', '/diseaseInstant',{id_patient: value}, auth.token)
    }
  }

  useEffect((()=>{
    console.log(response)
    if(response.data !== undefined && response.data.length>0){
      if(response.type === 'Patient'){
        console.log('Hola Si entro')
        setOptionsToDPIDoctor([])
        setOptionsToIdDisease([])
        setOptionsToDPIPatient(response.data.map((paciente) => ({
            value: paciente.dpi,
            description: paciente.namePatient
        })))
        if(patientDpi ===''){
            setOptionsToDPIPatient([])
        }
    } else if (response.type === 'Doctor'){
        setOptionsToDPIPatient([])
        setOptionsToIdDisease([])
        setOptionsToDPIDoctor(response.data.map((paciente) => ({
            value: paciente.dpi,
            description: paciente.nameDoctor
        })))
        if(docDpi ===''){
            setOptionsToDPIDoctor([])
        }
    } else if (response.type === 'Disease'){
        console.log(response.type)
        setOptionsToDPIPatient([])
        setOptionsToDPIDoctor([])
        setOptionsToIdDisease(response.data.map((paciente) => ({
            value: paciente.dpi,
            description: paciente.nameDisease
        })))
        console.log(optionsToIdDisease)
        if(diseaseId ===''){
            setOptionsToIdDisease([])
        }
    }
  }
    console.log(response)
}), [response])

useEffect(() => {
    console.log(dateStart)
},[dateStart])


return (
    <div >
        <ButtonRadius text={'Hello world'} accion={()=>console.log('Hola Mundo')}></ButtonRadius>
        <h1>Nueva Consulta</h1>

        <div className='contenedorConsulta' >
            <InputAutoComplete name={'DPI Paciente'} text={patientDpi} setText={(value) => handleGetPatients(value)} options={optionsToDPIPatient} width={200}></InputAutoComplete>
            <DateInput name={'Fecha Inicio'} date={dateStart} setDate={(value) => setDateStart(value)}></DateInput>
            <InputAutoComplete name={'DPI Medico'} text={docDpi} setText={(value) => handleGetDoc(value)} options={optionsToDPIDoctor} width={200}></InputAutoComplete>
            <InputAutoComplete name={'ID Enfermedad'} text={diseaseId} setText={(value) => handleGetDisease(value)} options={optionsToIdDisease} width={200}></InputAutoComplete>
            <InputAutoComplete name={'ID Enfermedad'} text={diseaseId} setText={(value) => handleGetDisease(value)} options={optionsToIdDisease} width={200}></InputAutoComplete>
        </div>

    </div>
  )
}