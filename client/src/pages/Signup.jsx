import React from 'react'
import Logo from '../assets/images/logo.png'
const Signup = () => {
  return (
    <div className='w-screen h-screen bg-slate-200 flex justify-center items-center'>
      <div className='w-[950px] h-[500px] flex flex justify-center items-center bg-white rounded-md overflow-hidden'>
        <div className='w-[600px]'>
          <img src={Logo} alt="logo" />
        </div>
        <div className='w-[350px] flex justify-center items-center p-5 bg-white h-hull'>
          <div className='text-[#2f2b3dc7] w-full relative'>
            <h2 className='text-2xl'>Sign up</h2>
            <form className='pt-4' >
              <div className='flex flex-col gap-y-2 mb-3'>
                <label htmlFor="name">Name</label>
                <input type="text" name='name' placeholder='name' id='name' className='input-field' />
              </div>
              <div className='flex flex-col gap-y-2 mb-3'>
                <label htmlFor="email">Email</label>
                <input type="email" name='email' placeholder='email' id='email' className='input-field' />
              </div>
              <div className='flex flex-col gap-y-2 mb-3'>
                <label htmlFor="password">Password</label>
                <input type="password" name='password' placeholder='password' id='password' className='input-field' />
              </div>
              <button className='w-full text-white px-3 py-2 rounded-[4px] outline-none bg-blue-500 mt-3 cursor-pointer hover:shadow-lg hover:bg-blue-600'>Sign up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup