import React from 'react'
import useAuthContext from '../context/UseAuthContext'

const Home = () => {
  const {store} = useAuthContext()
  console.log(store)
  return (
    <div>Home</div>
  )
}

export default Home