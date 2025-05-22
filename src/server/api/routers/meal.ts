import { and, eq } from "drizzle-orm";
import { handleTRPCError } from "~/lib/errors";
import { mealUpdateSchema, mealUploadSchema } from "~/schemas/meal";
import { meal_log } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

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
    }),
    deleteLog: protectedProcedure.input(z.object({
        id: z.number()
    })).mutation(async ({ ctx: { db, auth }, input }) => {
        try {
            await db.delete(meal_log).where(
                and(
                    eq(meal_log.id, input.id),
                    eq(meal_log.userId, auth.user.id)
                )
            )

            return {
                success: true,
                message: "Meal log deleted successfully"
            }
        } catch (error) {
            handleTRPCError(error)
        }
    }),
    updateLog: protectedProcedure.input(mealUpdateSchema).mutation(async ({ ctx: { db, auth }, input }) => {
        try {
            await db.update(meal_log).set({
                ...input,
                mealDate: new Date(input.mealDate),
            }).where(
                and(
                    eq(meal_log.id, input.id),
                    eq(meal_log.userId, auth.user.id)
                )
            )
            
            return {
                success: true,
                message: "Meal log updated successfully"
            }
        } catch (error) {
            handleTRPCError(error)
        }
    })
})