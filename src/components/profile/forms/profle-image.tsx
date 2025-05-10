"use client"

import { useForm } from '@tanstack/react-form'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useSession } from '~/lib/auth-client'

const profileImageSchema = z.object({
    image: z.instanceof(File).nullable()
}).refine((data) => {
    if (!data.image) {
        return false
    }
}, { message: 'Please select an image' })

const ProfileImage = () => {
    const { data, isPending: isFetchSessionPending, error, refetch } = useSession()

    if (error) {
        toast.error(error.message)
    }

    const form = useForm({
        defaultValues: {
            image: null as File | null
        },
        validators: {
            onChange: profileImageSchema
        },
        onSubmit: async ({ value }) => {
            console.log(value.image)
        }
    })

    if (isFetchSessionPending) {
        return <div>Loading...</div>
    }

    return (
        <div className='flex items-center gap-10'>
            <Avatar className='size-24'>
                <AvatarImage src={data?.user?.image ?? ''} />
                <AvatarFallback>
                    {data?.user?.name?.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <form onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()

                form.handleSubmit()
            }}>
                <Input
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                        form.setFieldValue('image', e.target.files?.[0] ?? null)
                        form.state.errors = []
                    }}
                />
                {form.getAllErrors().form.errors.map((err, i) => {
                    const error = Object.values(err ?? {})[0]?.[0]?.message


                    return (
                        <div key={i} className="text-red-500 text-sm mt-2">
                            {error}
                        </div>
                    )
                })}
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button
                            className='mt-6'
                            type="submit"
                            disabled={!canSubmit || isSubmitting}
                        >
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Edit Profile Image"}
                        </Button>
                    )}
                />
            </form>
        </div>
    )
}

export default ProfileImage