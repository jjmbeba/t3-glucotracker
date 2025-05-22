import { z } from "zod";

export const mealUploadSchema = z.object({
    mealDescription: z.string().min(1, { message: "Meal description is required" }),
    estimatedCarbs: z.number().min(1, { message: "Estimated carbs is required" }),
    mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack'], { message: "Meal type is required" }),
    mealDate: z.string(),
    notes: z.string(),
})

export const mealUpdateSchema = mealUploadSchema.extend({
    id: z.number(),
})
