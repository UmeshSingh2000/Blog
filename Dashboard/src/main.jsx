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
import SuperAdminDashboardLayout from './Pages/SuperAdmin/SuperAdminDashboardLayout'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <div><Toaster /></div>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* admin Private Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </PrivateRoute>
        }
        />
        {/* admin edit private route */}
        <Route path='/editBlog/:blogId' element={
          <PrivateRoute>
            <EditBlogInteractive />
          </PrivateRoute>
        } />


        {/* superAdmin Private Route */}
        <Route path="/superAdmin/dashboard" element={
          <PrivateRoute allowedRoles={['superAdmin']}>
            <SuperAdminDashboardLayout />
          </PrivateRoute>
        }
        />
      </Routes>
    </BrowserRouter>
  </Provider>
)
