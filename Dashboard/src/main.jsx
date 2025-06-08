import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import DashboardLayout from './Pages/DashboardLayout'
import { Toaster } from 'react-hot-toast'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <div><Toaster /></div>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<DashboardLayout />} />
    </Routes>
  </BrowserRouter>

)
