import React from 'react'
import useAuthContext from './context/UseAuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectRoute = () => {
    const { store, dispatch } = useAuthContext()

    if (store.user && store.token) {
        return <Outlet />
    } else {
        return <Navigate to={"/signin"} />
    }
}

export default ProtectRoute