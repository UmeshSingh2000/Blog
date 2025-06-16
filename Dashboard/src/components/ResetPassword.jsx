'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import Loader from "./Loader/Loader"

const api = import.meta.env.VITE_BACKEND_URL

const ResetPassword = () => {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const resetAll = () => {
        setStep(1)
        setEmail("")
        setOtp("")
        setNewPassword("")
        setConfirmPassword("")
        setLoading(false)
    }

    const handleSendOtp = async () => {
        if (!email) return toast.error("Please enter your email")
        try {
            setLoading(true)
            const res = await axios.post(`${api}/sendotp`, { email })
            if (res.status === 200) {
                toast.success(res.data.message)
                setStep(2)
            }
        } catch (error) {
            console.error("Error sending OTP:", error)
            toast.error(error.response?.data?.message || "Failed to send OTP")
            setStep(1)
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async () => {
        if (!otp) return toast.error("Enter the OTP")
        try {
            setLoading(true)
            const res = await axios.post(`${api}/verifyotp`, {
                otp,
                email,
            })
            if (res.status === 200) {
                toast.success(res.data.message)
                setStep(3)
            }
        } catch (error) {
            console.error("Error verifying OTP:", error)
            toast.error(error.response?.data?.message || "Invalid OTP")
            setStep(2)
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match")
        }
        if (!newPassword || !email) {
            return toast.error("Please fill in all fields")
        }
        try {
            setLoading(true)
            const res = await axios.post(`${api}/resetPassword`, {
                newPassword,
                email,
            })
            if (res.status === 200) {
                toast.success(res.data.message)
                resetAll()
                setOpen(false)
            }
        } catch (error) {
            console.error("Error resetting password:", error)
            toast.error(error.response?.data?.message || "Failed to reset password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetAll() }}>
            <DialogTrigger className="text-blue-500 cursor-pointer">Reset</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reset Your Password</DialogTitle>
                    <DialogDescription>
                        {step === 1 && "Enter your email to receive OTP"}
                        {step === 2 && "Enter the OTP sent to your email"}
                        {step === 3 && "Enter your new password"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {step === 1 && (
                        <>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {loading ? <Loader /> : (
                                <Button onClick={handleSendOtp}>Send OTP</Button>
                            )}
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            {loading ? <Loader /> : (
                                <Button onClick={handleVerifyOtp}>Verify OTP</Button>
                            )}
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <Input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <Input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {loading ? <Loader /> : (
                                <Button onClick={handleResetPassword}>Reset Password</Button>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ResetPassword
