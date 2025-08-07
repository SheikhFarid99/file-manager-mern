import { Routes, Route } from 'react-router-dom'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Home from './pages/Home'
import ProtectRoute from './ProtectRoute'

function App() {
  return <Routes>
    <Route path='/signin' element={<Signin />} />
    <Route path='/signup' element={<Signup />} />
    <Route path='/' element={<ProtectRoute />} >
      <Route path='' element={<Home />} />
    </Route>
  </Routes>
}

export default App
