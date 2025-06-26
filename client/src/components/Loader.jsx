import React from 'react'

const Loader = () => {
    return (
        <div className='w-full h-full flex justify-center items-center absolute left-0 top-0 bottom-0 bg-[#18171768] z-10'>
            <div className='border-gray-300 h-[50px] w-[50px] animate-spin rounded-full border-8 border-t-blue-600'></div>
        </div>
    )
}

export default Loader