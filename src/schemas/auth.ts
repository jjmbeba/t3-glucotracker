import z from "zod";

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, {
        message: 'Password must be at least 8 characters long'
    }),
    rememberMe: z.boolean()
})

export const signUpSchema = signInSchema.extend({
    firstName: z.string().min(1, {
        message: 'First name is required'
    }),
    lastName: z.string().min(1, {
        message: 'Last name is required'
    }),
    confirmPassword: z.string().min(8, {
        message: 'Confirm password must be at least 8 characters long'
    }),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match'
})
