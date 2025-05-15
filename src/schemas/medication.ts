import { z } from "zod";
import { medicationForms } from "~/constants";

export const medicationSetupSchema = z.object({
    name: z.string().min(1, {
        message: "Medication name is required"
    }),
    medicationForm: z.enum(medicationForms, {
        message: 'Select a medication form'
    }),
    strength: z.string(),
    defaultDoseUnits: z.number(),
    notes: z.string()
})

export const medicationUploadSchema = z.object({
    medicationId: z.number({
        message: "Select a valid medication"
    }).min(1, {
        message: "Medication ID is required"
    }),
    dosageAmountTaken: z.number().min(1, {
        message: "Dose amount must be greater than 0"
    }),
    dosageUnitTaken: z.string(),
    notes: z.string()
})

