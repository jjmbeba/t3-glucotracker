"use client"

import { formOptions, useForm } from '@tanstack/react-form'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { signInSchema } from '~/schemas/auth'
import SocialSignIn from './social'
import { api } from '~/trpc/react'
import { toast } from 'sonner'

type NewUser = z.infer<typeof signInSchema>

const SignInForm = () => {
    const defaultUser: NewUser = {
        email: "",
        password: "",
        rememberMe: false
    }

    const formOpts = formOptions({
        defaultValues: defaultUser
    })

    const { mutate: signIn, isPending: isSignInPending } = api.auth.signIn.useMutation({
        onSuccess: (data) => {
            toast.success(data.message)
        },
        onError: (error) => {
            console.error(error)
            toast.error(error.message)
        }
    })

    const form = useForm({
        ...formOpts,
        validators: {
            onBlur: signInSchema
        },
        onSubmit: async ({ value }) => {
            signIn(value)
        },
    })

    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()

            form.handleSubmit()
        }} className="grid gap-4">
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

            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                        Forgot your password?
                    </Link>
                </div>
                <form.Field
                    name="password"
                    children={(field) => (
                        <>
                            <Input
                                id="password"
                                type="password"
                                placeholder="password"
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

            <div className="flex items-center gap-2">
                <form.Field
                    name="rememberMe"
                    children={(field) => (
                        <>
                            <Checkbox
                                id="remember"
                                checked={field.state.value}
                                onCheckedChange={(checked) => field.handleChange(checked === true)}
                            />
                            <Label htmlFor="remember">Remember me</Label>
                        </>
                    )}
                />
            </div>
            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={!canSubmit || isSubmitting || isSignInPending}
                    >
                        {isSubmitting || isSignInPending ? <Loader2 size={16} className="animate-spin" /> : "Login"}
                    </Button>
                )}
            />
            <SocialSignIn />
        </form>
    )
}

export default SignInForm