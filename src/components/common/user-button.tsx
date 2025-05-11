"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import type { auth } from '~/auth'
import { signOut } from '~/lib/auth-client'
import { cn } from '~/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button, buttonVariants } from '../ui/button'
import { useQuery } from '@tanstack/react-query'
import { getSession } from '~/lib/auth-client'

const UserButton = ({ className, showLogout = false }: { className?: string, showLogout?: boolean }) => {
    const router = useRouter()

    const { data: session } = useQuery({
        queryKey: ['session'],
        queryFn: () => {
            return getSession()
        }
    })

    const user = session?.data?.user

    const initials = useMemo(() => {
        if (!user?.name) return ''

        return user.name.split(' ').map(name => name[0]).join('')
    }, [user?.name])

    return (
        <div role="navigation" aria-label="User menu">
            {user?.name ? (
                <div className='flex gap-4'>
                    <Link href='/settings/profile'>
                        <Avatar aria-label={`Profile picture of ${user.name}`}>
                            <AvatarImage src={user.image ?? undefined} alt={user.name ?? 'Profile picture'} />
                            <AvatarFallback>
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </Link>
                    {showLogout && (
                        <Button className='flex-1' onClick={() => signOut({
                            fetchOptions: {
                                onSuccess: () => {
                                    router.push('/')
                                    router.refresh()
                                }
                            }
                        })}>
                            Logout
                        </Button>
                    )}
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