"use client"

import { LogOut } from 'lucide-react'
import { signOut, useSession } from '~/lib/auth-client'
import { Button } from '../ui/button'

const Navbar = () => {
    const session = useSession()

    return (
        <div className='flex justify-between items-center px-10 py-5'>
            <Logo />
            <div>
                {session.data?.user.name ? (
                    <Button variant={'secondary'} onClick={() => signOut()}>
                        <LogOut />
                        Logout
                    </Button>
                ) : (
                    <div className='flex gap-2'>
                        Sign in
                    </div>
                )}
            </div>
        </div>
    )
}

const Logo = () => {
    return (
        <div className='text-2xl font-bold'>
            Logo
        </div>
    )
}

export default Navbar