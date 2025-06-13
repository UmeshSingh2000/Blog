import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader/Loader'
const api = import.meta.env.VITE_BACKEND_URL

const Login = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    })
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!userData.email || !userData.password) {
            toast.error("Please fill in all fields");
            return;
        }
        try {
            setLoading(true)
            const res = await axios.post(`${api}/login`, userData, {
                withCredentials: true
            })
            if (res.status === 200) {
                toast.success("Login successful");
                // Redirect to the dashboard or home page
                navigate('/dashboard');
            }
        }
        catch (error) {
            console.error("Login error:", error);

            if (error.response?.status === 401) {
                toast.error("Invalid credentials. Please try again.");
            } else if (error.response?.status === 404) {
                toast.error("User not found.");
            } else {
                toast.error("Login failed. Please try again.");
            }
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold">
                        Login to your account
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="mb-2">Email</Label>
                            <Input id="email" type="email" placeholder="you@example.com" value={userData.email} onChange={(e) => setUserData((prev) => {
                                return { ...prev, email: e.target.value }
                            })} />
                        </div>

                        <div>
                            <Label htmlFor="password" className="mb-2">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" value={userData.password} onChange={(e) => setUserData((prev) => {
                                return { ...prev, password: e.target.value }
                            })} />
                        </div>
                        {
                            loading ? (
                                <Button className="w-full cursor-pointer" disabled>
                                    Logging in...
                                </Button>
                            ) : (
                                <Button className="w-full cursor-pointer" onClick={handleLogin}>
                                    Login
                                </Button>
                            )
                        }

                    </form>

                    <p className="text-sm text-center text-gray-500 mt-4">
                        Don’t have an account?{" "}
                        <a href="/register" className="text-blue-600 hover:underline">
                            Register
                        </a>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login
