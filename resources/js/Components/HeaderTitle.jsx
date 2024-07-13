import { Link, router, usePage } from '@inertiajs/react'
import React from 'react'

const HeaderTitle = ({ backButton = false, backButtonLink = null, text = "" }) => {
    const { prevPage } = usePage().props
    return (
        <div className="flex gap-2 items-center">
            {
                backButton && (
                    <Link className='link-primary my-0 d-flex align-items-center text-decoration-none' href={backButtonLink || prevPage}>
                        <i className='bx bx-chevron-left fs-4'></i>
                    </Link>
                )
            }
            <p className="my-0 fs-6">{text}</p>
        </div>
    )
}

export default HeaderTitle