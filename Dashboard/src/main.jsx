import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import DashboardLayout from './Pages/DashboardLayout'
import { Toaster } from 'react-hot-toast'
import PrivateRoute from './components/PrivateRoute'
import { Provider } from 'react-redux'
import { store } from './Redux/store'
import EditBlogInteractive from './components/EditBlogInteractive'


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <div><Toaster /></div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
        />
        <Route path='/editBlog/:blogId' element={
          <PrivateRoute>
            <EditBlogInteractive />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  </Provider>
)
