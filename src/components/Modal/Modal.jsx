/* eslint-disable react/function-component-definition */
import React from 'react'
import './Modal.css'

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-container">
      <div className="modal-background" onClick={onClose} />
      <div className="modal">
      <div className="modal-content">{children}</div>
      </div>
    </div>
  )
}

export default Modal
