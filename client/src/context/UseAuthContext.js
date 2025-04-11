import { useContext } from 'react'
import AuthContext from './AuthContext'

const useAuthContext = () => {

  const context = useContext(AuthContext)

  return context
}

export default useAuthContext