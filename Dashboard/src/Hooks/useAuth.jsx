import { useEffect, useState } from 'react'
import axios from 'axios'
const api = import.meta.env.VITE_BACKEND_URL

const useAuth = () => {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${api}/auth/check`, {
          withCredentials: true,
        })
        if (res.status===200) {
          setIsAuthenticated(true)
        }
      } catch (err) {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { isAuthenticated, loading }
}

export default useAuth
