import { signInSchema } from "~/schemas/auth";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
    signIn: publicProcedure.input(signInSchema).mutation(async ({ input }) => {
        console.log(input)

        return {
            message: "Signed in successfully",
            success: true,
            user: {
                email: input.email,
                name: "John Doe"
            }
        }
    })
})