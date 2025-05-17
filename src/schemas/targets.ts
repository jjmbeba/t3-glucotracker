import { z } from "zod";

export const glucoseTargetSchema = z.object({
    targetName: z.string().min(1, {
        message: 'Target name must be at least 1 character'
    }),
    lowThreshold: z.number().min(1, {
        message: 'Low threshold must be greater than 0'
    }).max(500, {
        message: 'Low threshold must be less than 500'
    }),
    highThreshold: z.number().min(1, {
        message: 'High threshold must be greater than 0'
    }).max(500, {
        message: 'High threshold must be less than 500'
    }),
    units: z.enum(['mg/dL', 'mmol/L'], {
        message: 'Units must be either mg/dL or mmol/L'
    }),
}).refine((data) => {
    return data.lowThreshold < data.highThreshold
}, {
    message: 'Low threshold must be less than high threshold',
    path: ['lowThreshold', 'highThreshold']
})