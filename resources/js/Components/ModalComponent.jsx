import React from 'react'
import { Modal } from 'react-bootstrap'

const ModalComponent = ({ backdrop = true, centered = false, show = false, handleClose, title = "",bodyClassname="", children, size = "md",closeButton=false,className}) => {
    return (
        <Modal backdrop={backdrop} show={show} centered={centered} onHide={handleClose} size={size} className={className}>
            {title !== '' && (
                <Modal.Header closeButton={closeButton} >{title}</Modal.Header>
            )}
            <Modal.Body className={`${bodyClassname?? 'p-3'}`}>
                {children}
            </Modal.Body>
        </Modal>
    )
}

export default ModalComponent