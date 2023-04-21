import React from 'react'
import './Modal.css'

const Modal = ({ children, onClose }) => {
  const handleModalClick = (e) => {
    if (e.target.classList.contains('modal-background') && e.target.tagName !== 'INPUT') {
      onClose()
    }
  }
  return (
    <div className="modal-container">
      <div className="modal-background" onClick={handleModalClick} />
      <div className="modal">
        <div className="modal-content">{children}</div>
      </div>
    </div>
  )
}

export default Modal
