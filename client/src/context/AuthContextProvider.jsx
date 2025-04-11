import { useReducer } from 'react'
import AuthContextReducer from './AuthContextReducer'
import AuthContext from './AuthContext'
import { decode_token } from '../utils/decodeToken'


const AuthContextProvider = ({ children }) => {

  const [store, dispatch] = useReducer(AuthContextReducer, {
    user: decode_token(localStorage.getItem('auth-token') || "") || "",
    token: localStorage.getItem('auth-token')
  })


  return <AuthContext.Provider value={{ store, dispatch }} >
    {children}
  </AuthContext.Provider>

}

export default AuthContextProvider