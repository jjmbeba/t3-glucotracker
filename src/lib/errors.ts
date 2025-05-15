import { TRPCError } from "@trpc/server";

export function handleTRPCError(error: unknown, customMessage?: string): never {
    if (error instanceof TRPCError) throw error;

    if (error instanceof Error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: customMessage || error.message
        });
    }

    throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: customMessage || "An unexpected error occurred"
    });
}