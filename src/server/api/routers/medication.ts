import { medication } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { medicationSetupSchema } from "~/schemas/medication";
import { TRPCError } from "@trpc/server";


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
    })
})