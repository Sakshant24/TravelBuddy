import React from 'react'
import {FaGoogle} from "react-icons/fa6"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { usegoogleAuth } from '../../services/authApi'
import { toast } from 'sonner'
import {Button} from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

const LoginDialog = ({open, onClose, onLoginSuccess}) => {
  const handleLogin = usegoogleAuth({
    onSuccess:()=>{
      onClose()
      onLoginSuccess?.();
      toast.success("Login Successful")
    }
  })

  return (
    <Dialog open={open} onOpenChange={ onClose}>
        <DialogContent className="sm:max-w-94">
            <DialogHeader>
            <DialogTitle>Login to your account</DialogTitle>
            <DialogDescription>
                Log in to unlock AI itineraries and save your plans. Sync your travel schedules accross all your devices.
            </DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlfor="email">Email</Label>
                <Input
                    id='email'
                    type='email'
                    placeholder='m@example.com'
                    required
                />
              </div>
              <div className='grid gap-2'>
                    <div className='flex items-center'>
                      <Label htmlfor="password">Password</Label>
                      <a href='#'
                      className='ml-auto inline-block
                      text-sm underline-offset-4
                      hover:underline'>
                        Forgot your password?
                      </a>
                    </div>
                    <Input id='password' type='password' required/>
              </div>
            </div>
            <DialogFooter className="grid grid-cols-1 gap-3 mt-3">
              <Button type="submit" className="w-full rounded-md"
              disabled={true}>
                Login
              </Button>
              <Button onClick={handleLogin} className={"w-full rounded-md"}>
                <FaGoogle/> Login with Google
              </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
export default LoginDialog