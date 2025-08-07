import React, { useState } from 'react'
import Logo from '../assets/images/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { base_api_url } from '../config/config'
import toast from 'react-hot-toast'
import useAuthContext from '../context/UseAuthContext'
import { decode_token } from '../utils/decodeToken'


const Signin = () => {


  const { store, dispatch } = useAuthContext()
  const navigate = useNavigate()

  const [state, setState] = useState({
    email: '',
    password: ''
  })

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const [loader, setLoader] = useState(false)
  const submit_form = async (e) => {

    e.preventDefault()
    try {
      setLoader(true)
      const { data } = await axios.post(`${base_api_url}/api/file-manager/signin`, state)
      localStorage.setItem('auth-token', data.token)
      dispatch({
        type: 'signin-success',
        payload: {
          user: decode_token(data.token),
          token: data.token
        }
      })
      setLoader(false)
      navigate('/')
    } catch (error) {
      setLoader(false)
      toast.error(error?.response?.data?.message)
    }
  }



  return (
    <div className='w-screen h-screen bg-slate-200 flex justify-center items-center'>
      <div className='w-[950px] h-[500px] flex justify-center items-center bg-white rounded-md overflow-hidden'>
        <div className='w-[600px]'>
          <img src={Logo} alt="logo" />
        </div>
        <div className='w-[350px] flex justify-center items-center p-5 bg-white h-hull'>
          <div className='text-[#2f2b3dc7] w-full relative'>
            <h2 className='text-2xl'>Sign in</h2>

            <form onSubmit={submit_form} className='pt-4' >

              <div className='flex flex-col gap-y-2 mb-3'>
                <label htmlFor="email">Email</label>
                <input required onChange={inputHandle} value={state.email} type="email" name='email' placeholder='email' id='email' className='input-field' />
              </div>
              <div className='flex flex-col gap-y-2 mb-3'>
                <label htmlFor="password">Password</label>
                <input required onChange={inputHandle} value={state.password} type="password" name='password' placeholder='password' id='password' className='input-field' />
              </div>
              <button className='w-full text-white px-3 py-2 rounded-[4px] outline-none bg-blue-500 mt-3 cursor-pointer hover:shadow-lg hover:bg-blue-600'> {loader ? 'Loading...' : 'Sign in'} </button>
            </form>

            <div className='flex w-full mt-4 justify-center items-center gap-x-2'>
              <span className='text-[15px]'>Don't have an account?</span>
              <Link className='text-[15px] text-blue-500 hover:text-blue-600' to={'/signup'}>Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signin