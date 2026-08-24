import React, { useState } from 'react'
import { FaGoogle } from "react-icons/fa6"
import { LogIn } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useGoogleAuth } from '../../services/authApi'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

const LoginDialog = ({ open, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleGoogleLogin = useGoogleAuth({
    onSuccess: () => {
      onClose()
      onLoginSuccess?.()
      toast.success("Login Successful")
    }
  })

  const handleEmailLogin = (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Please enter both email and password.")
      return
    }
    const userData = {
      name: email.split('@')[0],
      email: email,
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`
    }
    localStorage.setItem("user", JSON.stringify(userData))
    toast.success("Login Successful!")
    onClose()
    onLoginSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-8 bg-[#FAF7F2] border border-stone-200 shadow-2xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-black text-stone-900 tracking-tight">
            Login to your account
          </DialogTitle>
          <DialogDescription className="text-stone-500 text-xs sm:text-sm font-medium leading-relaxed">
            Log in to unlock AI itineraries, save your plans, and sync your travel schedules across devices.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEmailLogin} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-black uppercase text-stone-900">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-2xl border-stone-300 bg-white text-stone-900 font-semibold focus:ring-2 focus:ring-[#C85A32] py-3"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-black uppercase text-stone-900">
                Password
              </Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-2xl border-stone-300 bg-white text-stone-900 font-semibold focus:ring-2 focus:ring-[#C85A32] py-3"
            />
          </div>

          <div className="pt-2 space-y-3">
            <Button
              type="submit"
              className="w-full rounded-2xl bg-[#C85A32] hover:bg-[#b04b27] text-white font-extrabold py-3 shadow-lg shadow-amber-900/20 cursor-pointer text-sm"
            >
              <LogIn className="w-4 h-4 mr-2" /> Login
            </Button>

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-stone-200 w-full" />
              <span className="bg-[#FAF7F2] px-3 text-[11px] font-bold text-stone-400 uppercase tracking-wider absolute">
                Or continue with
              </span>
            </div>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full rounded-2xl border-stone-300 bg-white hover:bg-stone-100 text-stone-900 font-extrabold py-3 cursor-pointer text-sm shadow-2xs"
            >
              <FaGoogle className="mr-2 text-[#C85A32]" /> Login with Google
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog