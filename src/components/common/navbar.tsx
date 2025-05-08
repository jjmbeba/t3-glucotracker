"use client"

import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import type { auth } from '~/auth'
import { signOut } from '~/lib/auth-client'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
type Session = Awaited<ReturnType<typeof auth.api.getSession>>

const Navbar = ({ session }: { session: Session }) => {
    const router = useRouter()
    const initials = useMemo(() => {
        return session?.user.name?.split(' ').map(name => name[0]).join('')
    }, [session?.user.name])
    
    return (
        <div className='flex justify-between items-center px-10 py-5'>
            <Logo />
            <div>
                {session?.user.name ? (
                    <div className='flex gap-4'>
                        <Avatar>
                            <AvatarImage src={session?.user.image ?? undefined} />
                            <AvatarFallback>
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <Button onClick={() => signOut({
                            fetchOptions: {
                                onSuccess: () => {
                                    router.push('/')
                                    router.refresh()
                                }
                            }
                        })}>
                            Logout
                        </Button>
                    </div>
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