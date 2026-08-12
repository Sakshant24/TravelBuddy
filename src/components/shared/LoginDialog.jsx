import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { usegoogleAuth } from '../../services/authApi'
import { toast } from 'sonner'

const LoginDialog = ({open, onClose}) => {
  const handleLogin = usegoogleAuth({
    onSuccess:()=>{
      onclose()
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
        </DialogContent>
    </Dialog>
  )
}
export default LoginDialog