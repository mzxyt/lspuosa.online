import React from 'react'
import { Image } from 'react-bootstrap'
import FileIcon from './FileIcon'

const UnitHeadReportCard = ({ data, handleClick }) => {

    return (
        <div className='p-3 bg-gray-100 w-100 cursor-pointer' onClick={handleClick}>
            <div className="header flex items-center gap-3">
                <Image
                    src={data.unit_head.image}
                    roundedCircle
                    fluid
                    width={30}
                    height={30}
                />
                <p className='my-0 text-sm col-8 text-truncate fw-bold'>
                    <span>{data.unit_head.firstname}</span>
                    <span className='ms-2'>{data.unit_head.lastname}</span>
                </p>
            </div>
            <div className="body text-center">
                <FileIcon
                    className={"mx-auto my-0"}
                    size='md'
                    file={data.attachments[0]}
                />

            </div>
            <div className="text-center">
                {
                    data.attachments.length > 1 ? (
                        <p className="my-0 text-sm">
                            <span className='me-1'>{data.attachments.length}</span>
                            <span>attachments</span>
                        </p>
                    ) : (
                        <p className="my-0 text-sm">
                            {data.attachments[0]?.name}
                        </p>
                    )
                }

            </div>
            <p className='text-sm mb-0 mt-3 text-secondary'>
                <small>{data.status}</small>
            </p>
        </div>
    )
}

export default UnitHeadReportCard