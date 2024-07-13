import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import Cropper from 'react-easy-crop'

const TransparentModal = ({ backdrop = true, centered = false, show = false, handleClose, title = "", children, size = "md", closeButton = false, className }) => {
    return (
        <div className='crop-container' aria-hidden={!show}>
         
            <div className="inner">
                {children}
            </div>
        </div>
    )
}

export default TransparentModal