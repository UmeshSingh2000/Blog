import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const Settings = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-1">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input id="username" type="text" placeholder="john_doe" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm font-medium">
                  New Password
                </Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>

              <Button type="submit" className="w-full mt-4">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Settings
