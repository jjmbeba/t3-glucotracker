import { createAuthClient } from "better-auth/react";
import { env } from "~/env";

export const { useSession, signOut, signIn, signUp } = createAuthClient({
    baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL
})