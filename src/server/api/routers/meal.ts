import { eq } from "drizzle-orm";
import { handleTRPCError } from "~/lib/errors";
import { mealUploadSchema } from "~/schemas/meal";
import { meal_log } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const mealRouter = createTRPCRouter({
    upload: protectedProcedure.input(mealUploadSchema).mutation(async ({ ctx: { auth, db }, input }) => {
        try {
            await db.insert(meal_log).values({
                ...input,
                mealDate: new Date(input.mealDate),
                userId: auth.user.id
            })

            return {
                success: true,
                message: "Meal uploaded successfully"
            }

        } catch (error) {
            handleTRPCError(error)
        }
    }),
    getLogs: protectedProcedure.query(async ({ ctx: { db, auth } }) => {
        try {
            return await db.select().from(meal_log).where(eq(meal_log.userId, auth.user.id))
        } catch (error) {
            handleTRPCError(error)
        }
    })
})