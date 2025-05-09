import React, { useEffect } from 'react'
import useAuthContext from '../context/UseAuthContext'
import axios from 'axios'
import { base_api_url } from '../config/config'

const Home = () => {

  const { store } = useAuthContext()

  const config = {
    headers: {
      Authorization: `Bearer ${store.token}`
    }
  }

  const getFiles = async () => {
    try {
      const { data } = await axios.get(`${base_api_url}/api/file-manager/lists`, config)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

    if (store.token) {
      getFiles()
    }
  }, [])
  return (
    <div>Home</div>
  )
}

export default Home