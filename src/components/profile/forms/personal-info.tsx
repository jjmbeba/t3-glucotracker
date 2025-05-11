"use client"

import { useForm } from '@tanstack/react-form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Skeleton } from '~/components/ui/skeleton'
import { getSession, updateUser } from '~/lib/auth-client'

const personalInfoSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2, {
        message: 'Name must have at least 2 characters'
    }),
})

const PersonalInformationSkeleton = () => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-9 w-full" />
            </div>
            <div className="grid gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-9 w-full" />
            </div>
            <div className="col-span-2 mt-6">
                <Skeleton className="h-9 w-[200px]" />
            </div>
        </div>
    )
}

const PersonalInformation = () => {
    const queryClient = useQueryClient()
    const { data, isPending: isFetchSessionPending, error } = useQuery({
        queryKey: ['session'],
        queryFn: () => {
            return getSession()
        }
    })

    if (error) {
        toast.error(error.message)
    }

    const user = data?.data?.user

    const form = useForm({
        defaultValues: {
            email: user?.email ?? '',
            name: user?.name ?? ''
        },
        validators: {
            onBlur: personalInfoSchema
        },
        onSubmit: async ({ value }) => {
            await updateUser({
                name: value.name,
            }, {
                onError: (error) => {
                    toast.error(error.error.message)
                },
                onSuccess: () => {
                    toast.success('Personal information updated')
                    queryClient.invalidateQueries({ queryKey: ['session'] })
                }
            })
        }
    })

    if (isFetchSessionPending) {
        return <PersonalInformationSkeleton />
    }


    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()

            form.handleSubmit()
        }}>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <form.Field
                        name="name"
                        children={(field) => (
                            <>
                                <Input
                                    id="name"
                                    placeholder="Max"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    disabled={isFetchSessionPending}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors.map((error, i) => (
                                    <div key={i} className="text-red-500 text-sm">
                                        {error?.message}
                                    </div>
                                ))}
                            </>
                        )}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <form.Field
                        name="email"
                        children={(field) => (
                            <>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    disabled
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors.map((error, i) => (
                                    <div key={i} className="text-red-500 text-sm">
                                        {error?.message}
                                    </div>
                                ))}
                            </>
                        )}
                    />
                </div>
            </div>
            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                    <Button
                        className='mt-6'
                        type="submit"
                        disabled={!canSubmit || isSubmitting}
                    >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Edit Personal Information"}
                    </Button>
                )}
            />
        </form>
    )
}

export default PersonalInformation