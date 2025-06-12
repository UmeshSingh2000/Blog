import React from "react"
import { Home, Users, Settings, PenLine, Lock } from "lucide-react"

const Sidebar = ({ setPage }) => {
  const menu = [
    { name: "Dashboard", icon: <Home className="w-4 h-4" />, key: "dashboard" },
    { name: "blogs", icon: <Users className="w-4 h-4" />, key: "blogs" },
    {
        name: "Create Blog",
        icon: <PenLine className="w-4 h-4" />, // Replace with actual icon for Create Blog
        key: "create-blog",
    },
    { name: "Settings", icon: <Settings className="w-4 h-4" />, key: "settings" },
    { name: "Logout", icon: <Lock className="w-4 h-4" />, key: "logout"}
  ]

  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
      {menu.map((item) => (
        <button
          key={item.key}
          onClick={() => setPage(item.key)}
          className="flex items-center gap-2 w-full p-2 rounded-md text-left hover:bg-gray-100 text-gray-700"
        >
          {item.icon}
          {item.name}
        </button>
      ))}
    </div>
  )
}

export default Sidebar
