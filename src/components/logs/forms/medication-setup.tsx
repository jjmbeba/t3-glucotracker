'use client'

import { useForm, useStore } from '@tanstack/react-form'
import React from 'react'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { SelectContent, SelectTrigger } from '~/components/ui/select'
import { SelectItem, SelectValue } from '~/components/ui/select'
import { Select } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { insulinForms, medicationForms, oralForms, type MedicationForm } from '~/constants'
import { capitalize } from '~/lib/utils'
import { medicationSetupSchema } from '~/schemas/medication'
import { api } from '~/trpc/react'
import { toast } from "sonner"
import { Loader2 } from 'lucide-react'

const MedicationSetup = () => {
    const { mutate: createMedication, isPending } = api.medication.setup.useMutation({
        onSuccess: (data) => {
            if (data?.success) {
                toast.success(data.message)
                form.reset()
            }
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const form = useForm({
        defaultValues: {
            name: "",
            medicationForm: "",
            strength: "",
            defaultDoseUnits: 0,
            notes: ""
        },
        validators: {
            onChange: medicationSetupSchema
        },
        onSubmit: ({ value }) => {
            createMedication({
                ...value,
                medicationForm: value.medicationForm as MedicationForm
            })
        }
    })

    const medicationForm = useStore(form.store, (state) => state.values.medicationForm)

    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()

            form.handleSubmit()
        }} className="grid gap-4 mt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Medication Name</Label>
                    <form.Field
                        name="name"
                        children={(field) => (
                            <>
                                <Input
                                    id="name"
                                    placeholder="Medication Name"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors.map((error, i) => (
                                    <div key={i} className="text-red-500 text-sm">
                                        {error?.message}
                                    </div>
                                ))}
                            </>
                        )}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="medicationForm">Medication Form</Label>
                    <form.Field
                        name="medicationForm"
                        children={(field) => (
                            <>
                                <Select onValueChange={(e) => field.handleChange(e)} defaultValue={field.state.value}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select a medication form" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {medicationForms.map((form, i) => (
                                            <SelectItem key={i} value={form}>{capitalize(form)}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {field.state.meta.errors.map((error, i) => (
                                    <div key={i} className="text-red-500 text-sm">
                                        {error?.message}
                                    </div>
                                ))}
                            </>
                        )}
                    />
                </div>
                <div className="grid gap-2">
                    <div className='flex items-center justify-between'>
                        <Label htmlFor="strength">Strength</Label>
                        <span className='text-xs text-muted-foreground'>
                            Optional
                        </span>
                    </div>
                    <form.Field
                        name="strength"
                        children={(field) => (
                            <>
                                <Input
                                    id="strength"
                                    placeholder="Strength e.g 100 units/mL or 500mg"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors.map((error, i) => (
                                    <div key={i} className="text-red-500 text-sm">
                                        {error?.message}
                                    </div>
                                ))}
                            </>
                        )}
                    />
                </div>
                <div className="grid gap-2">
                    <div className='flex items-center justify-between'>
                        <Label htmlFor="defaultDoseUnits">Default dose units</Label>
                        <span className='text-xs text-muted-foreground'>
                            Optional
                        </span>
                    </div>
                    <form.Field
                        name="defaultDoseUnits"
                        children={(field) => (
                            <div className='relative'>
                                <Input
                                    id="defaultDoseUnits"
                                    placeholder="Default dose units"
                                    type="number"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    disabled={medicationForm === ''}
                                    onChange={(e) => field.handleChange(Number(e.target.value))}
                                />
                                {medicationForm !== '' ? <span className='absolute right-1/6 top-1/2 -translate-y-4 text-xs text-muted-foreground'>
                                    {insulinForms.includes(medicationForm)
                                        ? 'units'
                                        : oralForms[medicationForm as keyof typeof oralForms] || ''}
                                </span> : null}
                                {field.state.meta.errors.map((error, i) => (
                                    <div key={i} className="text-red-500 text-sm">
                                        {error?.message}
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                </div>
                <div className="grid gap-2">
                    <div className='flex items-center justify-between'>
                        <Label htmlFor="notes">Notes</Label>
                        <span className='text-xs text-muted-foreground'>
                            Optional
                        </span>
                    </div>
                    <form.Field
                        name="notes"
                        children={(field) => (
                            <>
                                <Textarea
                                    id="notes"
                                    placeholder="Additional information about the medication"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors.map((error, i) => (
                                    <div key={i} className="text-red-500 text-sm">
                                        {error?.message}
                                    </div>
                                ))}
                            </>
                        )}
                    />
                </div>
            </div>
            <div>
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button type="submit" disabled={!canSubmit || isSubmitting || isPending}>
                            {isSubmitting || isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : "Submit"}
                        </Button>
                    )}
                />
            </div>
        </form>
    )
}

export default MedicationSetup