import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

const Login = () => {
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
                            <Input id="email" type="email" placeholder="you@example.com" required />
                        </div>

                        <div>
                            <Label htmlFor="password" className="mb-2">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" required />
                        </div>

                        <Button type="submit" className="w-full cursor-pointer">
                            Login
                        </Button>
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
