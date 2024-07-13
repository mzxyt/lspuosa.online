import React from 'react'
import { Button, Modal, Spinner } from 'react-bootstrap'
import { TextButton } from './CustomBtn'

const ConfirmModal = ({ processing = false, show = false, handleClose, onConfirm, onCancel, title = "Confirm action", message = "Are you sure?" }) => {
    return (
        <Modal backdrop={processing ? 'static' : 'none'} centered show={show} onHide={handleClose}>
            <Modal.Body className='p-4 text-start'>
                {/* <p className=' '><i className='bx bx-info-circle bx-lg  text-warning'></i></p> */}
                <p className="mt-1 mb-3 fs-5 fw-bold">{title}</p>
                <p className='my-1 fs-6 text-secondary fw-thin'>{message}</p>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-end border-0'>
                <TextButton disabled={processing} variant="secondary" onClick={onCancel} className=''>
                    Cancel
                </TextButton>
                <TextButton disabled={processing} variant="primary" onClick={onConfirm} className='rounded-1 px-3'>
                    <span className="">Confirm</span>
                    {
                        processing && (
                            <Spinner variant='light' size='sm' />
                        )
                    }
                </TextButton>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmModal