import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import Loader from "../Loader/Loader"
const api = import.meta.env.VITE_BACKEND_URL;

const AddUserDialog = () => {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    })
    const createUser = async () => {
        if (!userData.name || !userData.email || !userData.password || !userData.role) {
            toast.error("Please fill all fields")
            return
        }
        try {
            setLoading(true)
            const res = await axios.post(`${api}/superAdmin/register`,
                userData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.status === 201) {
                toast.success(res.data.message || "User created successfully")
                setOpen(false)
                setUserData({
                    name: '',
                    email: '',
                    password: '',
                    role: ''
                })
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create user")
        }
        finally {
            setLoading(false)

        }
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">Add User</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new User</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new user account.
                    </DialogDescription>
                </DialogHeader>

                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" onChange={handleInputChange} value={userData.name} placeholder="John Doe" />
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" name='email' onChange={handleInputChange} placeholder="john@example.com" value={userData.email} />
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name='password' onChange={handleInputChange} type="password" placeholder="Enter password" value={userData.password} />
                </div>

                {/* Role */}
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select onValueChange={(value) => {
                        setUserData((prev) => ({
                            ...prev,
                            role: value
                        }))
                    }}>
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="superAdmin">Super Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    {loading ? (
                        <div className="flex justify-center">
                            <Loader />
                        </div>
                    ) : (
                        <Button onClick={createUser} type="submit" className="w-full cursor-pointer">
                            Create User
                        </Button>
                    )}
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default AddUserDialog
