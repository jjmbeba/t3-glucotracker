import { glucoseFormSchema } from "~/schemas/logs";
import { glucoseLog } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

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
            if (error instanceof TRPCError) throw error;

            if (error instanceof Error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: error.message
                })
            }
        }
    }),
});
