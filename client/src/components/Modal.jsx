import React from 'react'
import { IoCloseSharp } from 'react-icons/io5'

const Modal = ({ children, onClose, title, isOpen }) => {
    return (
        <div className={`w-full absolute z-50 text-black justify-center items-center bg-[#1b1a1a65] h-full ${isOpen ? 'flex' : 'hidden'}`}>
            <div className='min-w-[350px] bg-white p-3 rounded-md'>
                <div className='flex justify-between items-center pb-3'>
                    <span>{title}</span>
                    <span onClick={onClose} className='text-2xl cursor-pointer'><IoCloseSharp /></span>
                </div>
                {
                    children
                }
            </div>
        </div>
    )
}

export default Modal