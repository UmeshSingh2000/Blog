// components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../Hooks/useAuth'

const PrivateRoute = ({ allowedRoles,children }) => {
  const { isAuthenticated, loading, role } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }
  return children
}

export default PrivateRoute
