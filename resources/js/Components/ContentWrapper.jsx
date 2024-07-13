import React from 'react'

const ContentWrapper = ({children, className=""}) => {
    return (
        <div className={`py-3 lg:px-[1.5rem] px-[1.2rem] ${className}`}>
            {children}
        </div>
    )
}

export default ContentWrapper
