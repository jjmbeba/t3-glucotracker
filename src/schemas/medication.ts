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