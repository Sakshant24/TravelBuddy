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

const LoginDialog = ({open, onClose}) => {
  const handleLogin = usegoogleAuth({
    onSuccess:()=>{
      onClose()
      toast.success("Login Successful")
    }
  })

  return (
    <Dialog open={open} onOpenChange={ onClose}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
            </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleLogin} className={"w-full rounded-md"}>
                <FaGoogle/> Login with Google
              </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
export default LoginDialog