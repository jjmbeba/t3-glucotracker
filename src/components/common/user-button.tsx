"use client"

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { getSession, signOut } from '~/lib/auth-client'
import { cn } from '~/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button, buttonVariants } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
const UserButton = ({ className, showLogout = false }: { className?: string, showLogout?: boolean }) => {
    const router = useRouter()

    const { data: session, isPending: isFetchSessionPending } = useQuery({
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

    if (isFetchSessionPending) {
        return <div className='flex gap-4'>
            <Skeleton className='size-8 rounded-full' />
            {showLogout && <Skeleton className={cn('h-8', className)} />}
        </div>
    }

    return (
        <div role="navigation" aria-label="User menu">
            {user?.name ? (
                <div className='flex gap-4'>
                    <Link href='/settings/profile'>
                        <Avatar aria-label={`Profile picture of ${user.name}`}>
                            <AvatarImage className='size-10' src={user.image ?? undefined} alt={user.name ?? 'Profile picture'} />
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