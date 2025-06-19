import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "./Loader/Loader";
import axios from "axios";
import { useDispatch } from "react-redux";
import { changePasswordVerified } from "@/Redux/Features/User/userSlice";
const api = import.meta.env.VITE_BACKEND_URL;

export default function VerifyPassword() {
  const dispatch = useDispatch()
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const verifyPassword = async () => {
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
    try {
      setLoading(true)
      const res = await axios.post(`${api}/verifyPassword`, { password }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      if (res.status === 200) {
        toast.success("Password verified successfully");
        dispatch(changePasswordVerified(true));
        setPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while verifying password.");
    }
    finally {
      setLoading(false);
    }
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Verify Your Password</CardTitle>
        <CardDescription>
          Enter your Password below to Verify your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form >
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  onClick={(e) => localStorage.clear('token')}
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        {loading ? <Loader /> :
          <Button type="submit" className="w-full cursor-pointer"
            onClick={verifyPassword}
          >
            Verify
          </Button>
        }
      </CardFooter>
    </Card>
  )
}

