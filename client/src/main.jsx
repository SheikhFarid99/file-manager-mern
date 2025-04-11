import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AuthContextProvider from './context/AuthContextProvider.jsx'

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <BrowserRouter>
      <App />
      <Toaster position='top-right' />
    </BrowserRouter>
  </AuthContextProvider>


)
