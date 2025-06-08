import React, { useState } from "react"

import Dashboard from "@/components/Dashboard"
import Sidebar from "@/components/Sidebar"
import Users from "@/components/Users"
import Settings from "@/components/Settings"
import CreateBlog from "@/components/CreateBlog"


const DashboardLayout = () => {
    const [page, setPage] = useState("dashboard")

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
