import { medication } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { medicationSetupSchema } from "~/schemas/medication";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";


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
            if(error instanceof TRPCError) throw error;

            if(error instanceof Error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: error.message
                })
            }
        }
    }),
    getMedicationSetup: protectedProcedure.input(z.object({
        namesOnly: z.boolean().optional().default(false)
    })).query(async ({ ctx: { db, auth }, input }) => {
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
            if (error instanceof TRPCError) throw error;

            if (error instanceof Error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: error.message
                })
            }
        }
    })
})