/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react'
import './BotonSeleccionableTriple.css'

export default function BotonSeleccionableTriple({ activeIndex, handleButtonClick}) {
  return (
    <div className="button-container">
      <button
        className={`button ${activeIndex === 0 ? 'active' : ''}`}
        onClick={() => handleButtonClick(0)}
        type="button"
      >
        5 pacientes con más asistencias
      </button>
      <button
        className={`button ${activeIndex === 1 ? 'active' : ''}`}
        onClick={() => handleButtonClick(1)}
        type="button"
      >
        Top 10 médicos que más pacientes han atendido
      </button>
      <button
        className={`button ${activeIndex === 2 ? 'active' : ''}`}
        onClick={() => handleButtonClick(2)}
        type="button"
      >
        3 unidades de salud que más pacientes atienden
      </button>
    </div>
  )
}
