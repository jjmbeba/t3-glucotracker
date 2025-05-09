"use client"

import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import type { auth } from '~/auth'
import { signOut } from '~/lib/auth-client'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button, buttonVariants } from '../ui/button'
import Link from 'next/link'
import { cn } from '~/lib/utils'
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
                <Link href="/sign-in" className={cn(buttonVariants({ variant: 'outline' }))}>
                    Sign in
                </Link>
            )}
        </div>
    )
}

export default UserButton