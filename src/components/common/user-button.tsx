"use client"

import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import type { auth } from '~/auth'
import { signOut } from '~/lib/auth-client'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
type Session = Awaited<ReturnType<typeof auth.api.getSession>>

const UserButton = ({ session }: { session: Session }) => {
    const router = useRouter()
    const initials = useMemo(() => {
        return session?.user.name?.split(' ').map(name => name[0]).join('')
    }, [session?.user.name])

    return (
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
                <Button className='flex gap-2'>
                    Sign in
                </Button>
            )}
        </div>
    )
}

export default UserButton