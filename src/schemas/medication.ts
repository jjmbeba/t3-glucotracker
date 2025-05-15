import { z } from "zod";
import { medicationForms } from "~/constants";

export const medicationSetupSchema = z.object({
    name: z.string().min(1, {
        message: "Medication name is required"
    }),
    medication_form: z.enum(medicationForms, {
        message: 'Select a medication form'
    }),
    strength: z.string(),
    default_dose_units: z.number(),
    notes: z.string()
})

export const medicationUploadSchema = z.object({
    medication_id: z.number().min(1, {
        message: "Medication ID is required"
    }),
    dose_amount_taken: z.number().min(1, {
        message: "Dose amount must be greater than 0"
    }),
    dose_unit_taken: z.string(),
    notes: z.string()
})

