import React from 'react'
import { Card } from 'react-bootstrap'

const CardComponent = ({className='',...props}) => {
  return (
    <Card className={`border-0 rounded-1 mt-3 shadow-sm p-lg-3 p-2 ${className}`} {...props}>

    </Card>
  )
}

export default CardComponent
