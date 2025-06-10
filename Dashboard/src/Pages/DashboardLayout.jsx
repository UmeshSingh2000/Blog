import React, { useState } from "react"

import Dashboard from "@/components/Dashboard"
import Sidebar from "@/components/Sidebar"
import Users from "@/components/Users"
import Settings from "@/components/Settings"
import CreateBlog from "@/components/CreateBlog"
import axios from "axios"
const URL = import.meta.env.VITE_BACKEND_URL

const DashboardLayout = () => {
    const [page, setPage] = useState("dashboard")
    const logout = async () => {
        try {
            const res = await axios.get(`${URL}/logout`, {
                withCredentials: true,
            });

            if (res.status === 200) {
                window.location.reload(); // Correct reload
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const renderContent = () => {
        switch (page) {
            case "dashboard":
                return <Dashboard />
            case "users":
                return <Users />
            case "create-blog":
                return <CreateBlog />
            case "settings":
                return <Settings />
            case 'logout':
                logout()
                return null
            default:
                return <Dashboard />
        }
    }

    return (
        <div className="flex">
            <Sidebar setPage={setPage} />
            <main className="flex-1 p-6 bg-gray-50 min-h-screen">
                {renderContent()}
            </main>
        </div>
    )
}

export default DashboardLayout
