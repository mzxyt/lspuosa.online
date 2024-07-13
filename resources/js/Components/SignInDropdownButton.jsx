import React from 'react'
import { useState } from 'react'

const CustomSelectDropdown = ({ selected = {}, menu, placeholder = 'Select...', handleSelect, disabled = false, className,size="lg",rounded=false,textAlign="center" }) => {
    const [expanded, setExpanded] = useState(false);
    const [selectedItem, setSelectedItem] = useState(selected);

    const onSelect = (item) => {
        setSelectedItem(item)
        setExpanded(false)
        handleSelect(item)
    }

    return (
        <div className={`${className}  custom-select ${size}`}>
            <div aria-expanded={expanded} onClick={() => setExpanded(s => !s)} className={`filled  ${rounded?'rounded':''} toggler-btn ${selected?'':'placeholder'} cursor-pointer`}>
                {selectedItem.text || placeholder}
            </div>
            <div aria-expanded={expanded} className="select-menu">
                {
                    menu && menu.map((item,index) => (
                        <div className={`select-menu-item `} aria-selected={selectedItem.value === item.value} key={index} onClick={() => onSelect(item)}>
                            {item.text}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default CustomSelectDropdown