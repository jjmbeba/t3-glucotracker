"use client"

import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import dayjs from 'dayjs'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"
import { Textarea } from '~/components/ui/textarea'
import { TimePicker } from '~/components/ui/time-picker'
import { toISOStringWithTimezone } from '~/lib/time-picker-utils'
import { capitalize, cn } from '~/lib/utils'
import { glucoseFormSchema } from '~/schemas/logs'
import { api } from '~/trpc/react'

type GlucoseCreateProps = {
    type: 'create'
}

type GlucoseUpdateProps = {
    type: 'update',
    id: number,
    defaultValues: z.infer<typeof glucoseFormSchema>
}

type Props = GlucoseCreateProps | GlucoseUpdateProps

const GlucoseForm = ({ type, ...props }: Props) => {
    const router = useRouter()
    const queryKey = getQueryKey(api.glucose.getLogs, undefined, 'query')
    const queryClient = useQueryClient()

    const { mutate: createGlucoseLog, isPending: isGlucoseLogPending } = api.glucose.create.useMutation({
        onSuccess: () => {
            form.reset()

            toast.success("Glucose log created successfully")
            router.refresh()
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey
            })
        }
    })

    const { mutate: updateGlucoseLog, isPending: isUpdateGlucoseLogPending } = api.glucose.update.useMutation({
        onSuccess: () => {
            form.reset()
            toast.success("Glucose log updated successfully")
            router.refresh()
        },
        onError: (error) => {
            toast.error(error.message)
            console.error(error)
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey
            })
        }
    })

    const form = useForm({
        defaultValues: type === 'update' && 'defaultValues' in props ? glucoseFormSchema.parse(props.defaultValues) : {
            glucose: 0,
            type: 'before-meal',
            date: new Date().toISOString(),
            units: 'imperial',
            notes: '',
        },
        validators: {
            onChange: glucoseFormSchema
        },
        onSubmit: ({ value }) => {
            if (type === 'create') {
                createGlucoseLog({
                    ...value,
                    type: value.type as "before-meal" | "after-meal" | "bedtime" | "fasting" | "random",
                    units: value.units as "imperial" | "metric",
                })
            } else {
                updateGlucoseLog({
                    ...value,
                    id: 'id' in props ? props.id : 0,
                    type: value.type as "before-meal" | "after-meal" | "bedtime" | "fasting" | "random",
                    units: value.units as "imperial" | "metric",
                })
            }
        }
    })

    return (
        <div className='mt-8'>
            <form onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()

                form.handleSubmit()
            }} className="grid gap-4 mt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="glucose">Glucose Level</Label>
                        <form.Field
                            name="glucose"
                            children={(field) => (
                                <>
                                    <Input
                                        id="glucose"
                                        type="number"
                                        placeholder="100"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(parseInt(e.target.value))}
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
                        <Label htmlFor="type">Type</Label>
                        <form.Field
                            name="type"
                            children={(field) => (
                                <>
                                    <Select
                                        value={field.state.value}
                                        defaultValue={field.state.value}
                                        onValueChange={(e) => field.handleChange(e)}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['before-meal', 'after-meal', 'bedtime', 'fasting', 'random'].map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {capitalize(type)}
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
                        <Label htmlFor="units">Units</Label>
                        <form.Field
                            name="units"
                            children={(field) => (
                                <>
                                    <Select
                                        value={field.state.value}
                                        defaultValue={field.state.value}
                                        onValueChange={(e) => field.handleChange(e)}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Units" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['imperial', 'metric'].map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {capitalize(type)} - {type === 'imperial' ? 'mg/dL' : 'mmol/L'}
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
                        <Label htmlFor="date">Date</Label>
                        <form.Field
                            name="date"
                            children={(field) => {
                                return (
                                    <>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !field.state.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.state.value ? (
                                                        dayjs(field.state.value).format("DD MMM YYYY HH:mm")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.state.value ? new Date(field.state.value) : undefined}
                                                    onSelect={(date) => field.handleChange(toISOStringWithTimezone(date ?? new Date()))}
                                                    initialFocus
                                                    disabled={(date) => date > new Date()}
                                                />
                                                <div className="p-3 border-t border-border">
                                                    <TimePicker
                                                        setDate={(date) => {
                                                            if (!date) return;

                                                            field.handleChange(toISOStringWithTimezone(date))
                                                        }}
                                                        date={new Date(field.state.value)}
                                                    />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        {field.state.meta.errors.map((error, i) => (
                                            <div key={i} className="text-red-500 text-sm">
                                                {error?.message}
                                            </div>
                                        ))}
                                    </>
                                )
                            }}
                        />
                    </div>
                    <div className="grid gap-2 col-span-1 md:col-span-2 lg:col-span-1">
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
                                        placeholder="Notes"
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
                            <div className='flex gap-2'>
                                <Button type='submit' disabled={!canSubmit || isSubmitting || isGlucoseLogPending || isUpdateGlucoseLogPending}>
                                    {isSubmitting || isGlucoseLogPending || isUpdateGlucoseLogPending ? <Loader2 className='size-4 animate-spin' /> : type === 'create' ? 'Create log' : 'Update log'}
                                </Button>
                                <Button type='button' variant={'outline'} onClick={() => {
                                    form.reset()
                                }}>
                                    Reset
                                </Button>
                            </div>
                        )}
                    />
                </div>
            </form>
        </div>
    )
}

export default GlucoseForm

