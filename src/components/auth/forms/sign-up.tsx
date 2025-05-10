"use client"
import { formOptions, useForm } from "@tanstack/react-form";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Label } from "~/components/ui/label";
import { signUp, useSession } from "~/lib/auth-client";
import { signUpSchema } from "~/schemas/auth";

const SignUpForm = () => {
    const router = useRouter()

    const formOpts = formOptions({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    })

    const form = useForm({
        ...formOpts,
        validators: {
            onBlur: signUpSchema
        },
        onSubmit: async ({ value }) => {
            const { email, password, firstName, lastName } = value

            await signUp.email({
                email,
                password,
                name: `${firstName} ${lastName}`
            }, {
                onError: (error) => {
                    toast.error(error.error.message)
                },
                onSuccess: (data) => {
                    toast.success("Sign up successful")
                    router.push('/')
                }
            })
        },
    })

    const { data } = useSession()

    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()

            form.handleSubmit()
        }} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <form.Field
                        name="firstName"
                        children={(field) => (
                            <>
                                <Input
                                    id="first-name"
                                    placeholder="Max"
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
                    <Label htmlFor="last-name">Last name</Label>
                    <form.Field
                        name="lastName"
                        children={(field) => (
                            <>
                                <Input
                                    id="last-name"
                                    placeholder="Robinson"
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
                <Label htmlFor="password">Password</Label>
                <form.Field
                    name="password"
                    children={(field) => (
                        <>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Password"
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
                <Label htmlFor="password">Confirm Password</Label>
                <form.Field
                    name="confirmPassword"
                    children={(field) => (
                        <>
                            <Input
                                id="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Confirm Password"
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
            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={!canSubmit || isSubmitting}
                    >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Create an account"}
                    </Button>
                )}
            />
        </form>
    )
}

export default SignUpForm

