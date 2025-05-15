export const medicationForms = ['tablet', 'capsule', 'injection-vial', 'injection-pen', 'injection-pump-basal', 'injection-pump-bolus', 'oral-solution'] as const;
export type MedicationForm = typeof medicationForms[number];

export const insulinForms = ['injection-vial', 'injection-pen', 'injection-pump-basal', 'injection-pump-bolus'];
export const oralForms = {
     tablet: 'tablet(s)',
     capsule: 'capsule(s)',
     'oral-solution': 'mL'
 };

export const doseUnits = ['tablet(s)', 'capsule(s)', 'mL', 'unit(s)'];
