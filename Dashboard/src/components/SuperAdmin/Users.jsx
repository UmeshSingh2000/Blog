import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import toast from 'react-hot-toast'
import axios from 'axios'
import AddUserDialog from "./AddUserDialog"

const api = import.meta.env.VITE_BACKEND_URL;

const Users = () => {
  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${api}/superAdmin/getAllUsers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (res.status === 200) {
        setUsers(res.data.users)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users")
    }
  }

  const handleBlockUserAccount = async (id) => {
    try {
      const res = await axios.post(`${api}/superAdmin/blockUserAccount/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (res.status === 200) {
        toast.success("User account blocked successfully")
        fetchUsers()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to block user account")
    }
  }

  const handleUnblockUserAccount = async (id) => {
    try {
      const res = await axios.post(`${api}/superAdmin/unBlockUserAccount/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (res.status === 200) {
        toast.success("User account unblocked successfully")
        fetchUsers()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unblock user account")
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Top Header with Add Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <AddUserDialog />
      </div>

      {/* Users List Section */}
      {users.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user, index) => (
            <Card key={user._id || index}>
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <p>Status: {user.status}</p>
                {user.status === "active" ? (
                  <Button
                    variant="destructive"
                    className="mt-3 cursor-pointer"
                    onClick={() => handleBlockUserAccount(user._id)}
                  >
                    Block User
                  </Button>
                ) : user.status === "blocked" ? (
                  <Button
                    variant="secondary"
                    className="mt-3 cursor-pointer"
                    onClick={() => handleUnblockUserAccount(user._id)}
                  >
                    Unblock User
                  </Button>
                ) : (
                  <Button variant="outline" className="mt-3" disabled>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No users found.</p>
      )}
    </div>
  )
}

export default Users
