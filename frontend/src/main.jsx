import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Bọc App ở đây để mọi component bên trong (kể cả Navbar) đều dùng được Router */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
