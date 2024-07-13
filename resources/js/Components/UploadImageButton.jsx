import React, { useRef } from 'react'
import { Button } from 'react-bootstrap'

const UploadImageButton = ({btnText = 'Choose photo', ...props }) => {
    const inputElem = useRef();

    return (
        <>
            <Button {...props} type='button'>
                {btnText}
            </Button>
            {/* input file element */}
            <input type='file' accept='image/*' ref={inputElem} />
        </>
    )
}

export default UploadImageButton