import React, { useState } from 'react'
import { FaGoogle } from "react-icons/fa6"
import { LogIn, UserPlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useGoogleAuth, loginWithBackend, registerWithBackend } from '../../services/authApi'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

const LoginDialog = ({ open, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = useGoogleAuth({
    onSuccess: () => {
      onClose()
      onLoginSuccess?.()
      toast.success("Logged in with Google!")
    },
    onError: (err) => {
      toast.error("Google authentication failed.")
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Please enter your email and password.")
      return
    }

    setLoading(true)
    try {
      if (isSignUp) {
        await registerWithBackend({ email, password, name })
        toast.success("Account created successfully!")
      } else {
        await loginWithBackend({ email, password })
        toast.success("Logged in successfully!")
      }
      onClose()
      onLoginSuccess?.()
    } catch (err) {
      toast.error(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-8 bg-[#FAF7F2] border border-stone-200 shadow-2xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-black text-stone-900 tracking-tight">
            {isSignUp ? "Create your account" : "Login to your account"}
          </DialogTitle>
          <DialogDescription className="text-stone-500 text-xs sm:text-sm font-medium leading-relaxed">
            {isSignUp
              ? "Sign up to start planning AI itineraries, saving trips, and syncing schedules."
              : "Log in to access your saved itineraries and personalized AI travel plans."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {isSignUp && (
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-black uppercase text-stone-900">
                Full Name (Optional)
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-2xl border-stone-300 bg-white text-stone-900 font-semibold focus:ring-2 focus:ring-[#C85A32] py-3"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-black uppercase text-stone-900">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-2xl border-stone-300 bg-white text-stone-900 font-semibold focus:ring-2 focus:ring-[#C85A32] py-3"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-black uppercase text-stone-900">
              Password
            </Label>
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
              disabled={loading}
              className="w-full rounded-2xl bg-[#C85A32] hover:bg-[#b04b27] text-white font-extrabold py-3 shadow-md shadow-[#C85A32]/20 cursor-pointer text-sm"
            >
              {loading ? (
                "Processing..."
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4 mr-2" /> Sign Up
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" /> Log In
                </>
              )}
            </Button>

            <div className="relative flex items-center justify-center my-3">
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
              <FaGoogle className="mr-2 text-[#C85A32]" /> Continue with Google
            </Button>
          </div>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-bold text-[#C85A32] hover:underline cursor-pointer"
          >
            {isSignUp
              ? "Already have an account? Log In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog