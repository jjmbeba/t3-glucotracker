"use client"

import { useForm } from '@tanstack/react-form'
import dayjs from 'dayjs'
import { CalendarIcon } from 'lucide-react'
import { z } from 'zod'
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
import { TimePickerDemo } from '~/components/ui/time-picker'
import { toISOStringWithTimezone } from '~/lib/time-picker-utils'
import { capitalize, cn } from '~/lib/utils'

const glucoseFormSchema = z.object({
    glucose: z.number().min(0).max(500),
    date: z.string(),
    // time: z.string().datetime(),
    type: z.enum(['before-meal', 'after-meal', 'bedtime', 'fasting', 'random']),
    units: z.enum(['imperial', 'metric']),
    notes: z.string(),
})

const GlucoseForm = () => {
    const form = useForm({
        defaultValues: {
            glucose: 0,
            type: 'before-meal',
            date: new Date().toISOString(),
            units: 'imperial',
            // time: new Date().toLocaleTimeString(),
            notes: '',
        },
        validators: {
            onChange: glucoseFormSchema
        },
        onSubmit: ({ value }) => {
            console.log(value)
        }
    })

    return (
        <div className='mt-8'>
            <form onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()

                form.handleSubmit()
            }} className="grid gap-4 mt-3">
                <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="glucose">Glucose</Label>
                        <form.Field
                            name="glucose"
                            children={(field) => (
                                <>
                                    <Input
                                        id="glucose"
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
                                                            "w-[280px] justify-start text-left font-normal",
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
                                                    <TimePickerDemo
                                                        setDate={(date) => field.handleChange(toISOStringWithTimezone(date ?? new Date()))}
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
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
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
                                <Button type='submit' disabled={!canSubmit || isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
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

