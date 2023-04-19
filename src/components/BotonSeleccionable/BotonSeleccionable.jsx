/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react'
import './BotonSeleccionable.css'

export default function BotonSeleccionable({ activeIndex,  handleButtonClick, indicador1, indicador2 }) {
  return (
    <div className="button-container">
      <button
        className={`button ${activeIndex === 0 ? 'active' : ''}`}
        onClick={() => handleButtonClick(0)}
        type="button"
      >
        Inventario cercano a agotar
        <span className={`indicator ${activeIndex === 0 ? '"active"' : ''}${activeIndex === 0 && ' zero'}`}>
          {indicador1}
        </span>
      </button>
      <button
        className={`button ${activeIndex === 1 ? 'active' : ''}`}
        onClick={() => handleButtonClick(1)}
        type="button"
      >
        Inventario cercano a vencer
        <span className={`indicator ${activeIndex === 1 ? 'active' : ''}${activeIndex === 1 && ' zero'}`}>
          {indicador2}
        </span>
      </button>
    </div>
  )
}
