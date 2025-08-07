import React from 'react'

const UploadProgress = ({ progress }) => {
    return (
        <div className='w-full h-full absolute left-0 to-0 flex justify-center items-center bg-[#44444462] z-50'>
            <div className='p-4'>
                <div className='relative size-40'>
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">

                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200" stroke-width="2"></circle>

                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-green-600" stroke-width="2" strokeDasharray="100" strokeDashoffset={100 - progress} strokeLinecap="round"></circle>
                    </svg>
                    <div className='absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2'>
                        <span className='text-center text-2xl font-bold text-green-500'>{progress}%</span>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default UploadProgress