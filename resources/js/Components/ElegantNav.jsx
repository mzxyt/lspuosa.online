import React from 'react'

const ElegantNav = ({ list, activeKey, handleSelect, variant = 'primary', className, disableClick = false, selector, selectedItem, scrollable = false }) => {

    const nav = list.map(selector);

    return (
        <>
            <ul className={`elegant-nav nav gap-10 ${className} ${scrollable ? "scrollable" : ""}`}>
                {
                    nav && nav.map((item, index) => (
                        <li key={index} onClick={() => disableClick ? {} : handleSelect(list[index])} className={` ${disableClick ? '' : 'cursor-pointer'} px-4 pt-3  pb-3 list-item ${list[index] == selectedItem ? `border-t-[2px] fw-bold border-${variant} text-${variant}` : 'text-secondary'}`}>
                            {item}
                        </li>
                    ))
                }
            </ul>
        </>
    )
}

export default ElegantNav