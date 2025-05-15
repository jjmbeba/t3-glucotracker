import { medication, medication_log } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { medicationSetupSchema, medicationUploadSchema } from "~/schemas/medication";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { handleTRPCError } from "~/lib/errors";


export const medicationRouter = createTRPCRouter({
    setup: protectedProcedure.input(medicationSetupSchema).mutation(async ({ ctx: { db, auth }, input }) => {
        try {
            const { user } = auth;

            await db.insert(medication).values({
                ...input,
                userId: user.id,
            })

            return {
                success: true,
                message: "Medication setup created successfully"
            }
        } catch (error) {
            handleTRPCError(error)
        }
    }),
    getMedicationSetup: protectedProcedure.input(z.object({
        namesOnly: z.boolean().optional().default(false)
    })).query<Array<{ name: string, id: number }> | Array<typeof medication.$inferSelect>>(async ({ ctx: { db, auth }, input }) => {
        try {
            const { user } = auth;

            if(input.namesOnly){
                return await db.select({
                    name: medication.name,
                    id: medication.id
                }).from(medication).where(eq(medication.userId, user.id));
            }

            return await db.select().from(medication).where(eq(medication.userId, user.id));

        } catch (error) {
            handleTRPCError(error)
        }
    }),
    uploadLog: protectedProcedure.input(medicationUploadSchema).mutation(async ({ ctx: { db, auth }, input }) => {
        try {
            const { user } = auth;

            await db.insert(medication_log).values({
                ...input,
                userId: user.id
            })

            return {
                success: true,
                message: "Medication log uploaded successfully"
            }
            
            
        }catch(error){
            handleTRPCError(error)
        }
    })
})