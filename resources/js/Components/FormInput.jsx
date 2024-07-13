import React from 'react'
import { Form } from 'react-bootstrap'

const FormInput = ({ label = null, controlId, feedback, invalid = false, ...props }) => {
    return (
        <>
            <div className="custom-input-group">
                {label != null && (
                    <Form.Label>{label}</Form.Label>
                )}
                <div className="inner">
                    <Form.Control
                        {
                        ...props
                        }
                        className={invalid?'border border-danger text-danger':''}
                    />
                    <div className="icon">
                        {
                            invalid ? (
                                <i className=' bx bx-info-circle text-danger'></i>
                            ):(
                                <i className=' bx bx-check text-success'></i>
                            )
                        }
                    </div>
                </div>
                <p className={`text-${invalid ? 'danger' : 'success'} text-sm mb-0 mt-2`}>{feedback}</p>

            </div>
        </>
    )
}

export default FormInput