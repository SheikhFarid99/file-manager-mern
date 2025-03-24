import React, { useState } from 'react'
import Logo from '../assets/images/logo.png'
import { Link } from 'react-router-dom'

const Signup = () => {

  const [state, setState] = useState({
    name: '',
    email: '',
    password: ''
  })

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const [otpData, setOtpData] = useState({
    number1: '',
    number2: '',
    number3: '',
    number4: ''
  })

  const otpInputHandle = (e) => {
    setOtpData({
      ...otpData,
      [e.target.name]: e.target.value
    })
  }

  const [submit_res, set_submit_res] = useState(false)
  const [res, setRes] = useState(false)

  const submit_form = (e) => {
    e.preventDefault()
    try {
      setRes(true)
      set_submit_res(true)
    } catch (error) {
      set_submit_res(false)
    }
  }

  const otp_submit = (e) => {
    e.preventDefault()
    console.log(otpData)
  }


  return (
    <div className='w-screen h-screen bg-slate-200 flex justify-center items-center'>
      <div className='w-[950px] h-[500px] flex justify-center items-center bg-white rounded-md overflow-hidden'>
        <div className='w-[600px]'>
          <img src={Logo} alt="logo" />
        </div>
        <div className='w-[350px] flex justify-center items-center p-5 bg-white h-hull'>
          <div className='text-[#2f2b3dc7] w-full relative'>
            <h2 className='text-2xl'>Sign up</h2>
            {
              res ? <>
                <p>Please enter the authentication code sent to your email.</p>
                <form onSubmit={otp_submit} className='mt-4'>
                  <div className='w-full flex flex-col gap-y-2'>
                    <div className='w-full grid grid-cols-4 gap-x-3'>
                      <input onChange={otpInputHandle} value={otpData.number1} required name='number1' className='input-field' type="text" />
                      <input required onChange={otpInputHandle} value={otpData.number2} name='number2' className='input-field' type="text" />
                      <input required onChange={otpInputHandle} value={otpData.number3} name='number3' className='input-field' type="text" />
                      <input required onChange={otpInputHandle} value={otpData.number4} name='number4' className='input-field' type="text" />
                    </div>
                    <button className='w-full text-white px-3 py-2 rounded-[4px] outline-none bg-blue-500 mt-3 cursor-pointer hover:shadow-lg hover:bg-blue-600'>Submit</button>
                  </div>
                </form>
              </> : <form onSubmit={submit_form} className='pt-4' >
                <div className='flex flex-col gap-y-2 mb-3'>
                  <label htmlFor="name">Name</label>
                  <input required onChange={inputHandle} value={state.name} type="text" name='name' placeholder='name' id='name' className='input-field' />
                </div>
                <div className='flex flex-col gap-y-2 mb-3'>
                  <label htmlFor="email">Email</label>
                  <input required onChange={inputHandle} value={state.email} type="email" name='email' placeholder='email' id='email' className='input-field' />
                </div>
                <div className='flex flex-col gap-y-2 mb-3'>
                  <label htmlFor="password">Password</label>
                  <input required onChange={inputHandle} value={state.password} type="password" name='password' placeholder='password' id='password' className='input-field' />
                </div>
                <button className='w-full text-white px-3 py-2 rounded-[4px] outline-none bg-blue-500 mt-3 cursor-pointer hover:shadow-lg hover:bg-blue-600'>Sign up</button>
              </form>
            }

            <div className='flex w-full mt-4 justify-center items-center gap-x-2'>
              <span className='text-[15px]'>Already have an account?</span>
              <Link className='text-[15px] text-blue-500 hover:text-blue-600' to={'/signin'}>Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup