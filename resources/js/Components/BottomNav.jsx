import React from 'react'

const BottomNav = ({ isActive, setIsActive }) => {
    return (
        <div className=' fixed-bottom min-h-[8vh] w-full bottom-0 left-0 bg-white border-t border-t-3 border-[#9f9f9f]'>
            <div className="nav-control top-0">
                <div onClick={() => setIsActive((state => !state))} className={`hamburger ${isActive ? '' : 'is-active'}`}>
                    <span className="line"></span>
                    <span className="line"></span>
                    <span className="line"></span>
                </div>
            </div>
        </div>
    )
}

export default BottomNav