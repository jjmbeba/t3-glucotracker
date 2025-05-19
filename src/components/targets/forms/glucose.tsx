'use client'

import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import { InfoIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { glucoseTargetSchema } from '~/schemas/targets'
import { api } from '~/trpc/react'

const GlucoseTargetForm = () => {
    const queryClient = useQueryClient()

    const targetsKey = getQueryKey(api.glucose.getTargets, undefined, 'query')

    const { mutate: setTargets, isPending: isSetTargetsPending } = api.glucose.setTargets.useMutation({
        onSuccess: () => {
            toast.success('Targets set successfully')
            queryClient.invalidateQueries({ queryKey: targetsKey })
            form.reset()
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        }
    })

    const form = useForm({
        defaultValues: {
            targetName: 'Default',
            lowThreshold: 80,
            highThreshold: 140,
            units: 'mg/dL' as 'mg/dL' | 'mmol/L',
        },
        onSubmit: ({ value }) => {
            setTargets(value)
        },
        validators: {
            onChange: glucoseTargetSchema
        }
    })

    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()

            form.handleSubmit()
        }} className="grid gap-4 mt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="targetName">Target Name</Label>
                    <form.Field
                        name="targetName"
                        children={(field) => (
                            <>
                                <Input
                                    id="targetName"
                                    type="text"
                                    placeholder="Default"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                {field.state.meta.errors.map((error, i) => (
                                    <div key={`${error?.path}-${i}`} className="text-red-500 text-sm">
                                        {error?.message}
                                    </div>
                                ))}
                            </>
                        )}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="lowThreshold">Low Threshold</Label>
                    <form.Field
                        name="lowThreshold"
                        children={(field) => (
                            <>
                                <Input
                                    id="lowThreshold"
                                    type="number"
                                    placeholder="100"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(parseInt(e.target.value))}
                                />
                                {field.state.meta.errors.map((error, i) => (
                                    <div key={`${error?.path}-${i}`} className="text-red-500 text-sm">
                                        {error?.message}
                                    </div>
                                ))}
                            </>
                        )}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="highThreshold">High Threshold</Label>
                    <form.Field
                        name="highThreshold"
                        children={(field) => (
                            <>
                                <Input
                                    id="highThreshold"
                                    type="number"
                                    placeholder="100"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(parseInt(e.target.value))}
                                />
                                {field.state.meta.errors.map((error, i) => (
                                    <div key={`${error?.path}-${i}`} className="text-red-500 text-sm">
                                        {error?.message}
                                    </div>
                                ))}
                            </>
                        )}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="units">Units</Label>
                    <form.Field
                        name="units"
                        children={(field) => (
                            <>
                                <Select 
                                    onValueChange={(value) => field.handleChange(value as 'mg/dL' | 'mmol/L')} 
                                    defaultValue={field.state.value}
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Select a unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mg/dL">mg/dL</SelectItem>
                                        <SelectItem value="mmol/L">mmol/L</SelectItem>
                                    </SelectContent>
                                </Select>
                                {field.state.meta.errors.map((error, i) => (
                                    <div key={`${error?.path}-${i}`} className="text-red-500 text-sm">
                                        {error?.message}
                                    </div>
                                ))}
                            </>
                        )}
                    />
                </div>
            </div>
            <div>
                <span className='text-sm text-muted-foreground flex items-center gap-2'>
                    <InfoIcon className='size-4' />
                    The low threshold must be less than the high threshold
                </span>
                <span className='text-sm text-muted-foreground flex items-center gap-2'>
                    <InfoIcon className='size-4' />
                    Please consult your doctor for the recommended targets
                </span>
            </div>
            <div className='flex gap-2'>
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <div className='flex gap-2'>
                            <Button type='submit' disabled={!canSubmit || isSubmitting || isSetTargetsPending}>
                                {isSubmitting || isSetTargetsPending ? <Loader2 className='size-4 animate-spin' /> : 'Save'}
                            </Button>
                        </div>
                    )}
                />
            </div>
        </form>
    )
}

export default GlucoseTargetForm