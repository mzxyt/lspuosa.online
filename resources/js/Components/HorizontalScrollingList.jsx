import React from 'react'
import { Spinner } from 'react-bootstrap'

const HorizontalScrollingList = ({ list, loading=false, selector }) => {
  return (
    <div className='h-scrolling-list'>
      <div className='list'>
        {
          loading ? (
            <div className="">
              <p className="my-1 fs-5">...</p>
            </div>
          ) : (
            list && list.length > 0 ? (
              list.map(selector)
            ) : (
              <p className='mb-1 mt-2 text-black-50 text-sm'>Nothing to show.</p>
            )
          )
        }
      </div>
    </div>
  )
}

export default HorizontalScrollingList