import React, { useState } from 'react'
import { Plus, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import LoginDialog from './LoginDialog'
import Logo from './Logo'
import { googleLogout } from '@react-oauth/google'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Header = () => {
    const [openDialog, setOpenDialog] = useState(false)
    const user = JSON.parse(localStorage.getItem("user"))
    const navigate = useNavigate()

    const handleLogout = () => {
        googleLogout()
        localStorage.removeItem("user")
        navigate('/')
        window.location.reload()
    }

    return (
        <header className='bg-[#FAF7F2]/90 backdrop-blur-xl border-b border-stone-200/80 px-6 py-3.5 flexBetween fixed top-0 left-0 right-0 w-full z-50 shadow-2xs transition-all'>
            {/* Logo - Bespoke TravelBuddy Brand Vector Logo */}
            <Link to={'/'} className='flex items-center gap-x-3 cursor-pointer group'>
                <Logo size={40} />
                <div className='flex flex-col'>
                    <span className='font-black text-xl tracking-tight text-stone-900 leading-none'>
                        TravelBuddy
                    </span>
                    <span className='text-[10px] font-bold text-[#C85A32] tracking-wider uppercase'>
                        AI Travel Agent
                    </span>
                </div>
            </Link>

            {/* Buttons & Profile */}
            <div className='flex items-center gap-x-3 sm:gap-x-4'>
                <Button 
                    onClick={() => navigate('/create-trip')} 
                    variant='outline' 
                    className='rounded-2xl border-stone-300 bg-white/90 hover:bg-stone-100/90 text-stone-900 font-extrabold cursor-pointer shadow-2xs hover:shadow-xs transition-all text-xs sm:text-sm py-2 px-4'
                >
                    <Plus className="w-4 h-4 mr-1 text-[#C85A32]" />
                    Create Trip
                </Button>
                <div className='flex items-center'>
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="p-0 border-none cursor-pointer outline-none ring-2 ring-[#C85A32]/20 rounded-full transition-all hover:ring-[#C85A32]/50">
                                <img src={user?.picture} alt='userProfile' height={38} width={38} className='rounded-full border border-stone-300 shadow-xs' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-2xl border-stone-200 p-2 shadow-xl bg-white/95 backdrop-blur-md min-w-[160px]">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="text-xs font-bold text-stone-400 uppercase tracking-wider px-2 py-1">
                                        My Account
                                    </DropdownMenuLabel>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator className="my-1 bg-stone-100" />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => navigate('/create-trip')} className="rounded-xl cursor-pointer font-bold text-xs text-stone-900 py-2">
                                        Create Trip
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/my-trips')} className="rounded-xl cursor-pointer font-bold text-xs text-stone-900 py-2">
                                        My Trips
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="my-1 bg-stone-100" />
                                    <DropdownMenuItem onClick={handleLogout} className="rounded-xl cursor-pointer font-bold text-xs text-rose-600 py-2 focus:bg-rose-50">
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button 
                            onClick={() => setOpenDialog(true)} 
                            className="bg-[#C85A32] hover:bg-[#b04b27] text-white font-extrabold px-5 py-2 rounded-2xl cursor-pointer shadow-md shadow-[#C85A32]/20 hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm"
                        >
                            <User className="w-4 h-4 mr-1.5" />
                            Login
                        </Button>
                    )}
                    <LoginDialog open={openDialog} onClose={() => setOpenDialog(false)} />
                </div>
            </div>
        </header>
    )
}

export default Header