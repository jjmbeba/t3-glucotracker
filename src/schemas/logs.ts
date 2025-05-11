import { z } from "zod";

export const glucoseFormSchema = z.object({
    glucose: z.number().min(0).max(500),
    date: z.string(),
    type: z.enum(['before-meal', 'after-meal', 'bedtime', 'fasting', 'random']),
    units: z.enum(['imperial', 'metric']),
    notes: z.string(),
})