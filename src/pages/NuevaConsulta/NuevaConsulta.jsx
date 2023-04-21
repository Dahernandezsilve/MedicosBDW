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

import DateInput from "../../components/DateInput/DateInput.jsx"
import TreatmentContainer from "../../components/TreatmentContainer/TreatmentContainer.jsx";

// ----------------------------------------------------------------------



const ButtonRadius = ({text, accion}) =>{

  return(
      <button style={{
            borderRadius: '8px',
            color: 'white',
            outline: 'none',
            width: '150px',
            height: '60px',
            fontSize: '8px',
            fontWeight: 'bold',
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
    const [diseaseId, setDiseaseId] = useState(0)
    const [docDpi, setDocDpi] = useState('')
    const [unitId, setUnitId] = useState(0)
    const [response, loading, handleRequest] = useApi()
    const [tratamientos, setTratamientos] = useState([])
    const [optionsToDPIPatient, setOptionsToDPIPatient] = useState([])
    const [optionsToUnitID, setOptionsToUnitID] = useState([])
    const [optionsToDPIDoctor, setOptionsToDPIDoctor] = useState([])
    const [optionsToIdDisease, setOptionsToIdDisease] = useState([])
    const [idConsult, setIdConsult] = useState(-1)
    const [dateStart, setDateStart] = useState('')
    const [description, setDescription] = useState('')
    const [evolution, setEvolution] = useState('')
    const [wordCount, setWordCount] = useState(0)
    const [wordCount2, setWordCount2] = useState(0)

    const handleChange = (event) => {
        const inputValue = event.target.value;
        const inputWordCount = inputValue.trim().split(/\s+/).length;

        if (inputWordCount <= 100) {
            setDescription(inputValue);
            setWordCount2(inputWordCount);
        }
    }

    const handleChangeEvolution = (event) => {
        const inputValue = event.target.value;
        const inputWordCount = inputValue.trim().split(/\s+/).length;

        if (inputWordCount <= 100) {
            setEvolution(inputValue);
            setWordCount(inputWordCount);
        }
    }

    const handleGetPatients = (value) => {
        console.log(value)
        const regex = /^\d+$/
        console.log(regex.test(value))
        if ((regex.test(value) || value === '') && value.length <= 13) {
            setPatientDpi(value)
            handleRequest('POST', '/patientInstant',{key: value}, auth.token)
        }
    }

    const handleGetDoc = (value) => {
        console.log(value)
        const regex = /^\d+$/
        console.log(regex.test(value))
        if ((regex.test(value) || value === '') && value.length <= 13) {
            setDocDpi(value)
            handleRequest('POST', '/docInstant',{key: value}, auth.token)
        }
    }

    const handleClickButtonSend = () => {
        handleRequest('POST', '/createConsult', {patientDpi, docDpi, diseaseId, unitId, dateStart, description, evolution}, auth.token)
    }

    const handleGetUnit = (value) => {
        console.log(value)
        const regex = /^\d+$/
        console.log(regex.test(value))
        if ((regex.test(value) || value === '') && value.length <= 13) {
            setUnitId(value)
            handleRequest('POST', '/unitInstant',{key: value}, auth.token)
        }
    }


    const handleGetDisease = (value) => {
        console.log(value)
        const regex = /^\d+$/
        console.log(regex.test(value))
        if ((regex.test(value) || value === '') && value.length <= 13) {
            setDiseaseId(value)
            handleRequest('POST', '/diseaseInstant',{key: value}, auth.token)
        }
    }

    useEffect((()=>{
        console.log(response)
        if(response.idConsult !== undefined && response.idConsult !== ''){
            setIdConsult(response.idConsult)
        }

        if(response.data !== undefined && response.data.length>0){
            if(response.type === 'Patient'){
                console.log('Hola Si entro')
                setOptionsToDPIDoctor([])
                setOptionsToIdDisease([])
                setOptionsToUnitID([])
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
                setOptionsToUnitID([])
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
                setOptionsToUnitID([])
                setOptionsToIdDisease(response.data.map((paciente) => ({
                    value: paciente.dpi,
                    description: paciente.nameDisease
                })))
                console.log(optionsToIdDisease)
                if(diseaseId ===''){
                    setOptionsToIdDisease([])
                }
            } else if (response.type === 'Unit'){
                console.log(response.type)
                setOptionsToDPIPatient([])
                setOptionsToDPIDoctor([])
                setOptionsToIdDisease([])
                setOptionsToUnitID(response.data.map((paciente) => ({
                    value: paciente.dpi,
                    description: paciente.nameUnit
                })))
                console.log(optionsToUnitID)
                if(unitId ===''){
                    setOptionsToUnitID([])
                }
            }



        }
        console.log(response)
    }), [response])


    useEffect(() => {
        console.log('Hola Mundo')
        tratamientos.map((tratamiento) => {
            console.log(tratamiento)
            const {idInsumo,dosis,fechaInicio,fechaFinal} = tratamiento
            handleRequest('POST', '/createTratamient', {idInsumo,dosis,fechaInicio,fechaFinal,idConsult}, auth.token)
        })

        setTratamientos([])
        setEvolution('')
        setDescription('')
        setDiseaseId(0)

    }, [idConsult])

    useEffect(() => {
        console.log(dateStart)
    },[dateStart])

    useEffect(() => {
        console.log(tratamientos)
    }, [tratamientos])


  return (
        <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px'
        }}>

            <h1>Nueva Consulta</h1>

            <div className='contenedorConsulta' >
                <InputAutoComplete name={'DPI Paciente'} text={patientDpi} setText={(value) => handleGetPatients(value)} options={optionsToDPIPatient} width={200}></InputAutoComplete>
                <DateInput name={'Fecha Inicio'} date={dateStart} setDate={(value) => setDateStart(value)}></DateInput>
                <InputAutoComplete name={'DPI Medico'} text={docDpi} setText={(value) => handleGetDoc(value)} options={optionsToDPIDoctor} width={200}></InputAutoComplete>
                <InputAutoComplete name={'ID Enfermedad'} text={diseaseId} setText={(value) => handleGetDisease(value)} options={optionsToIdDisease} width={200}></InputAutoComplete>
                <InputAutoComplete name={'ID Unidad de salud'} text={unitId} setText={(value) => handleGetUnit(value)} options={optionsToUnitID} width={250}></InputAutoComplete>
            </div>
            <div className='contenedorConsulta'>
                <h3>Descripcion</h3>
                <h3>Evolucion</h3>
                <textarea className='toDescription'
                    value={description}
                    onChange={handleChange}
                    rows={6}
                    cols={50}
                    placeholder="Escribe algo (máximo 100 palabras)"
                />
                <textarea className='toDescription'
                          value={evolution}
                          onChange={handleChangeEvolution}
                          rows={6}
                          cols={50}
                          placeholder="Escribe algo (máximo 100 palabras)"
                />
                <TreatmentContainer treatments={tratamientos} setTreatments={(value) => setTratamientos(value)}></TreatmentContainer>
                <ButtonRadius text={'Enviar'} accion={()=>handleClickButtonSend()} ></ButtonRadius>
            </div>




        </div>
  )
}
