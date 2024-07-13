import { useThemeState } from '@/States/States'
import React from 'react'
import { Form } from 'react-bootstrap'

const ThemeSwitch = () => {
    const { theme, setTheme } = useThemeState();

    const changeTheme = () => {
        let newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme)
    }

    return (
        <>
            <div className=' cursor-pointer' onClick={changeTheme}>
                <div className={` rounded-[10px] w-[40px] h-[40px] flex items-center text-center p-1 justify-center bg-${theme === 'light'?'light':'secondary'}`}>
                    <i className={`fi fi-rr-${theme === 'light' ? 'moon' : 'sun'} text-${theme === 'light' ? 'dark' : 'white-50'} leading-none font-[1.1rem]`}></i>
                </div>
            </div>
            {/* <Form.Check
                onChange={changeTheme}
                checked={theme === 'dark'}
                type="switch"
                id="theme-switch"
                label="Dark Mode"
            /> */}
        </>
    )
}

export default ThemeSwitch