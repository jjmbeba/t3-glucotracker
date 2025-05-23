import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { ai } from "~/gemini";
import { handleTRPCError } from "~/lib/errors";
import { glucoseFormSchema } from "~/schemas/logs";
import { glucoseTargetSchema, glucoseTargetUpdateSchema } from "~/schemas/targets";
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
            const glucoseLogs = await db.select().from(glucoseLog).where(eq(glucoseLog.userId, auth.user.id))
            const glucoseTargets = await db.select().from(glucose_target).where(eq(glucose_target.userId, auth.user.id))

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `
                You are a diabetes educator.
                You are given a list of glucose logs.
                You are to provide a summary according to the glucose logs and the target (if set).
                The logs and target are as follows:
                ${JSON.stringify(glucoseLogs)} 
                ${JSON.stringify(glucoseTargets)}
                Make it short and concise. It should be a single sentence. Make recommendations for the user based on the input.
                `,
            })

            return response.text

        } catch (error) {
            handleTRPCError(error)
        }
    }),
    getGlucoseAnalysis: protectedProcedure.query(async ({ ctx: { db, auth } }) => {
        try {
            const glucoseLogs = await db.select().from(glucoseLog).where(eq(glucoseLog.userId, auth.user.id))

            const response = await ai.models.generateContent({
                model: "gemini-1.5-flash",
                contents: `
                You are a diabetes educator.
                You are given a list of glucose logs.
                You are to provide a detailed analysis of the glucose logs.
                The logs are as follows:
                ${JSON.stringify(glucoseLogs)}
                Make it short and concise. It should be a single sentence. Highlight the number of highs (above 140mg/dL) and lows (below 80mg/dL) over a certain time period.
                `,
            })

            return response.text
        } catch (error) {
            handleTRPCError(error)
        }
    })
});
