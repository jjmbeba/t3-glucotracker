import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./server/db";
import { nextCookies } from "better-auth/next-js"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg'
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        }
    },
    plugins: [nextCookies()],
});



