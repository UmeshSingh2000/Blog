import { useEffect, useState } from 'react'
import axios from 'axios'
const api = import.meta.env.VITE_BACKEND_URL

const useAuth = () => {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [role,setRole] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${api}/auth/check`,{
          headers:{
            Authorization : `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (res.status===200) {
          setIsAuthenticated(true)
          setRole(res.data.user.role)
        }
      } catch (err) {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { isAuthenticated, loading, role }
}

export default useAuth
