import React, { useEffect, useState } from "react"
import Dashboard from "@/components/Dashboard"
import Sidebar from "@/components/Sidebar"
import Settings from "@/components/Settings"
import CreateBlog from "@/components/CreateBlog"
import Blogs from "@/components/Blogs"
import { Menu } from "lucide-react"
import { useNavigate } from "react-router-dom"

const DashboardLayout = () => {
    const navigate = useNavigate()
    const [page, setPage] = useState("dashboard")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const renderContent = () => {
        switch (page) {
            case "dashboard": return <Dashboard />
            case "blogs": return <Blogs />
            case "create-blog": return <CreateBlog />
            case "settings": return <Settings />
            case "logout": return null
            default: return <Dashboard />
        }
    }

    useEffect(()=>{
        if(page==='logout'){
            localStorage.removeItem("token")
            navigate("/")
        }
    },[page,navigate])

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Mobile menu button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 md:hidden absolute top-4 left-4 z-50 bg-white rounded-md shadow-md"
            >
                <Menu size={24} />
            </button>

            {/* Sidebar */}
            <div
                className={`fixed z-40 inset-y-0 left-0 transform ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:w-64`}
            >
                <Sidebar setPage={(page) => {
                    setPage(page)
                    setSidebarOpen(false) // Close sidebar on mobile when a page is selected
                }} />
            </div>

            {/* Overlay when sidebar is open on mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <main className="flex-1 min-h-screen ml-0 overflow-auto">
                {renderContent()}
            </main>
        </div>
    )
}

export default DashboardLayout
