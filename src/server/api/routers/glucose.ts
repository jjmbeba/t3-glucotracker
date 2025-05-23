import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { ai } from "~/gemini";
import { handleTRPCError } from "~/lib/errors";
import { glucoseFormSchema } from "~/schemas/logs";
import { glucoseTargetSchema, glucoseTargetUpdateSchema } from "~/schemas/targets";
import { glucose_target, glucoseLog } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "~/env";

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
    }),
    setTargets: protectedProcedure.input(glucoseTargetSchema).mutation(async ({ ctx: { db, auth }, input }) => {
        try {
            await db.insert(glucose_target).values({
                ...input,
                userId: auth.user.id,
            })

            return {
                success: true,
                message: "Targets set successfully"
            }
        } catch (error) {
            handleTRPCError(error)
        }
    }),
    deleteTarget: protectedProcedure.input(z.number()).mutation(async ({ ctx: { db, auth }, input }) => {
        try {
            await db.delete(glucose_target).where(
                and(
                    eq(glucose_target.id, input),
                    eq(glucose_target.userId, auth.user.id)
                )
            )

            return {
                success: true,
                message: "Target deleted successfully"
            }
        } catch (error) {
            handleTRPCError(error)
        }
    }),
    updateTarget: protectedProcedure.input(glucoseTargetUpdateSchema).mutation(async ({ ctx: { db, auth }, input }) => {
        try {
            await db.update(glucose_target).set({
                ...input,
            }).where(
                and(
                    eq(glucose_target.id, input.id),
                    eq(glucose_target.userId, auth.user.id)
                )
            )

            return {
                success: true,
                message: "Target updated successfully"
            }
        } catch (error) {
            handleTRPCError(error)
        }
    }),
    getSummary: protectedProcedure.query(async ({ ctx: { db, auth } }) => {
        try {
            const glucoseLogs = await db.select({
                glucose: glucoseLog.glucose,
                date: glucoseLog.date,
            }).from(glucoseLog).where(eq(glucoseLog.userId, auth.user.id))
            const glucoseTargets = await db.select({
                highThreshold: glucose_target.highThreshold,
                lowThreshold: glucose_target.lowThreshold,
                units: glucose_target.units,
            }).from(glucose_target).where(eq(glucose_target.userId, auth.user.id))

            const response = await ai.models.generateContent({
                model: env.GEMINI_MODEL,
                contents: [
                    {
                        role: "user",
                        parts: [{
                            text: `As a diabetes educator, analyze these glucose readings and provide a concise summary with recommendations. Glucose logs: ${JSON.stringify(glucoseLogs)}. Targets: ${JSON.stringify(glucoseTargets)}. Provide a single sentence summary with recommendations.`
                        }]

                    }
                ],
            })

            return response.text

        } catch (error) {
            handleTRPCError(error)
        }
    }),
    getGlucoseAnalysis: protectedProcedure.query(async ({ ctx: { db, auth } }) => {
        try {
            const glucoseLogs = await db.select({
                glucose: glucoseLog.glucose,
                date: glucoseLog.date,
            }).from(glucoseLog).where(eq(glucoseLog.userId, auth.user.id))

            const response = await ai.models.generateContent({
                model: env.GEMINI_MODEL,
                contents: [{
                    role: "user",
                    parts: [{
                        text: `As a diabetes educator, analyze these glucose readings and provide a concise summary with recommendations. Glucose logs: ${JSON.stringify(glucoseLogs)}. Provide a single sentence summary with recommendations.`
                    }]
                }],
            })

            return response.text
        } catch (error) {
            handleTRPCError(error)
        }
    })
});
