"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import type { auth } from '~/auth'
import { signOut } from '~/lib/auth-client'
import { cn } from '~/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button, buttonVariants } from '../ui/button'
type Session = Awaited<ReturnType<typeof auth.api.getSession>>

const UserButton = ({ session, className }: { session: Session, className?: string }) => {
    const router = useRouter()
    const initials = useMemo(() => {
        if(!session?.user.name) return ''

        return session.user.name.split(' ').map(name => name[0]).join('')
    }, [session?.user.name])

    return (
        <div role="navigation" aria-label="User menu">
            {session?.user.name ? (
                <div className='flex gap-4'>
                    <Avatar aria-label={`Profile picture of ${session?.user.name}`}>
                        <AvatarImage src={session?.user.image ?? undefined} alt={session?.user.name ?? 'Profile picture'} />
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
                <Link href="/sign-in" className={cn(buttonVariants({ variant: 'outline' }), className)}>
                    Sign in
                </Link>
            )}
        </div>
    )
}

export default UserButton