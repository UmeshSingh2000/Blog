// components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom'
import useAuth from '../Hooks/useAuth'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return isAuthenticated ? children : <Navigate to="/" replace />
}

export default PrivateRoute
