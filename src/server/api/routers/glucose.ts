import { desc, eq } from "drizzle-orm";
import { handleTRPCError } from "~/lib/errors";
import { glucoseFormSchema } from "~/schemas/logs";
import { glucose_target, glucoseLog } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const glucoseRouter = createTRPCRouter({
    create: protectedProcedure.input(glucoseFormSchema).mutation(async ({ ctx: { db, auth }, input }) => {
        try {
            await db.insert(glucoseLog).values({
                ...input,
                date: new Date(input.date),
                userId: auth.user.id,
            })

            return {
                success: true,
                message: "Glucose log created successfully"
            }
        } catch (error) {
            handleTRPCError(error)
        }
    }),
    getLogs: protectedProcedure.query(async ({ ctx: { db, auth } }) => {
        try {
            return await db.select({
                id: glucoseLog.id,
                glucose: glucoseLog.glucose,
                date: glucoseLog.date,
            }).from(glucoseLog).where(eq(glucoseLog.userId, auth.user.id)).orderBy(glucoseLog.date).limit(100)
        } catch (error) {
            handleTRPCError(error)
        }
    }),
    getLastLog: protectedProcedure.query(async ({ ctx: { db, auth } }) => {
        try {
            return await db.select({
                id: glucoseLog.id,
                glucose: glucoseLog.glucose,
                date: glucoseLog.date,
            }).from(glucoseLog).where(eq(glucoseLog.userId, auth.user.id)).orderBy(desc(glucoseLog.date)).limit(1).offset(0)
        } catch (error) {
            handleTRPCError(error)
        }
    }),
    getTargets: protectedProcedure.query(async ({ ctx: { db, auth } }) => {
        try {
            return await db.select().from(glucose_target).where(eq(glucose_target.userId, auth.user.id))
        } catch (error) {
            handleTRPCError(error)
        }
    })
});
