'use client'

import { useForm, useStore } from '@tanstack/react-form';
import { Info, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { doseUnits } from '~/constants';
import { medicationUploadSchema } from '~/schemas/medication';
import { api } from '~/trpc/react';

const MedicationUploadForm = () => {
    const { data: medicationSetup, isLoading, error } = api.medication.getMedicationSetup.useQuery({
        namesOnly: true
    });

    const { mutate: uploadLog, isPending } = api.medication.uploadLog.useMutation({
        onSuccess: (data) => {
            toast.success(data?.message)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    if (error) {
        toast.error(error.message)
    }

    const form = useForm({
        defaultValues: {
            medicationId: medicationSetup?.[0]?.id ?? 0,
            dosageAmountTaken: 0,
            dosageUnitTaken: doseUnits[0] ?? "",
            notes: ""
        },
        validators: {
            onChange: medicationUploadSchema
        },
        onSubmit: ({ value }) => {
            uploadLog(value)
        }
    })

    if (isLoading) {
        return <div className='min-h-[70vh] flex items-center justify-center gap-4'>
            <Loader2 className='size-5 animate-spin' />
            Loading your medication...
        </div>
    }

    if (medicationSetup?.length === 0) {
        return <div className='min-h-[70vh] flex items-center justify-center'>
            <div className=' flex items-start justify-center gap-4 max-w-lg text-center'>
                <Info className='size-5' />
                No medication setup found. Please create a medication setup first in the setup tab.
            </div>
        </div>
    }

    const medicationId = useStore(form.store, (state) => state.values.medicationId)

    useEffect(() => {
        if (medicationId === 0) {
            form.setFieldValue('medicationId', medicationSetup?.[0]?.id!)
        }

    }, [medicationId, form])


    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()

            form.handleSubmit()
        }} className="grid gap-4 mt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="medicationId">Medication</Label>
                    <form.Field
                        name="medicationId"
                        children={(field) => (
                            <>
                                <Select value={field.state.value.toString()} onValueChange={(e) => {
                                    field.handleChange(parseInt(e))
                                }}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select your medication" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {medicationSetup?.map((medication) => (
                                            <SelectItem key={medication.id} value={medication.id.toString()}>
                                                {medication.name}
                                            </SelectItem>
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
                    <Label htmlFor="dosageAmountTaken">Dose Amount Taken</Label>
                    <form.Field
                        name="dosageAmountTaken"
                        children={(field) => (
                            <>
                                <Input type='number' value={field.state.value} onChange={(e) => field.handleChange(parseInt(e.target.value))} />
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
                    <Label htmlFor="dosageUnitTaken">Dose Unit Taken</Label>
                    <form.Field
                        name="dosageUnitTaken"
                        children={(field) => (
                            <>
                                <Select value={field.state.value} onValueChange={(e) => field.handleChange(e)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a dose unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {doseUnits.map((unit) => (
                                            <SelectItem key={unit} value={unit}>{unit}</SelectItem>
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
                    <Label htmlFor="notes">Notes</Label>
                    <form.Field
                        name="notes"
                        children={(field) => (
                            <>
                                <Textarea
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Enter notes"
                                    className="w-full"
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
                        <Button type='submit' disabled={!canSubmit || isSubmitting || isPending}>
                            {isSubmitting ? <Loader2 className='size-4 animate-spin' /> : "Submit"}
                        </Button>
                    )}
                />
            </div>
        </form>
    )
}

export default MedicationUploadForm