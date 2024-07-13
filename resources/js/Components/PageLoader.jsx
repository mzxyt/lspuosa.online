import React from 'react'
import LoadingAnimation from '@/animations/folders.json'
import { useLottie } from 'lottie-react'
const PageLoader = ({ show = false }) => {
    const options = {
        animationData: LoadingAnimation,
        loop: true
    };

    const { View: Animation } = useLottie({
        animationData: LoadingAnimation,
        loop: true,
    })


    return (
        <div className={`page-loader-wrapper ${show ? 'show' : ''}`}>
            <div className="">
                <div className="page-loader">
                    {Animation}
                </div>
                <p className="my-1 text-center text-sm">Loading...</p>
            </div>
        </div>
    )
}

export default PageLoader