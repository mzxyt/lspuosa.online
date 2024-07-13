import React from 'react'
import { useState } from 'react'
import ModalComponent from './ModalComponent'
import { createRoot } from 'react-dom/client'

export const ConfirmDialogContainer = () => {
    return (<div id='confirm-dialog-container'></div>)
}

const Dialog = ({handleOnConfirm,onClose}) => {
    const [show, setShow] = useState(false)
    return (
        <ModalComponent show={show} handleClose={() => {
            setShow(s => !s)
            onClose()
        }}>
            <div className="p-3">
                <p className='fs-5'>Confirm Action</p>
            </div>
        </ModalComponent>
    )
}

export const showConfirmDialog = () => {
    const container = document.getElementById('confirm-dialog-container');
    let root = createRoot(container);

    const onFinish = () =>{
        return 
    }

    root.render(
        <Dialog
            onClose={onFinish}
        />
    )
}


// export const Dialog = () => {
//     const [show, setShow] = useState(true)

//     return (
//         <ModalComponent show={show} handleClose={() => setShow(s => !s)}>
//             <div className="p-3">
//                 <p className='fs-5'>Confirm Action</p>
//             </div>
//         </ModalComponent>
//     )
// }
