import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import toast from 'react-hot-toast'
import axios from 'axios'
import AddUserDialog from "./AddUserDialog"
const api = import.meta.env.VITE_BACKEND_URL;
const Users = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Top Header with Add Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <AddUserDialog />
      </div>

      {/* Users List Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Example User Card – map actual data later */}
        {[1, 2, 3].map((user, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>User {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Email: user{index + 1}@example.com</p>
              <p>Role: Admin</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Users
