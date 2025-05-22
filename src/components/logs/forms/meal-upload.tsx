'use client'

import { useForm } from '@tanstack/react-form'
import dayjs from 'dayjs'
import { Calendar } from '~/components/ui/calendar'
import { CalendarIcon, Loader2 } from 'lucide-react'
import React from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from '~/components/ui/select'
import { cn } from '~/lib/utils'
import { Textarea } from '~/components/ui/textarea'
import { mealUploadSchema } from '~/schemas/meal'
import { TimePicker } from '~/components/ui/time-picker'
import { toISOStringWithTimezone } from '~/lib/time-picker-utils'

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

const MealUpload = () => {
    const form = useForm({
        defaultValues: {
            mealDescription: '',
            estimatedCarbs: 0,
            mealType: 'breakfast' as MealType,
            mealDate: new Date().toISOString(),
            notes: '',
        },
        validators: {
            onChange: mealUploadSchema
        },
        onSubmit: ({ value }) => {
            console.log(value)
        }
    })

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()

                form.handleSubmit()
            }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="mealType">Meal Type</Label>
                        <form.Field
                            name="mealType"
                            children={(field) => (
                                <>
                                    <Select
                                        defaultValue={field.state.value}
                                        onValueChange={(value) => field.handleChange(value as MealType)}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder="Select meal type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="breakfast">Breakfast</SelectItem>
                                            <SelectItem value="lunch">Lunch</SelectItem>
                                            <SelectItem value="dinner">Dinner</SelectItem>
                                            <SelectItem value="snack">Snack</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {field.state.meta.errors.map((error, i) => (
                                        <div key={`${field.name}-error-${i}`} className="text-red-500 text-sm">
                                            {error?.message}
                                        </div>
                                    ))}
                                </>
                            )}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="mealDescription">Meal Description</Label>
                        <form.Field
                            name="mealDescription"
                            children={(field) => (
                                <>
                                    <Textarea
                                        id="mealDescription"
                                        placeholder="Meal Description"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.errors.map((error, i) => (
                                        <div key={`${field.name}-error-${i}`} className="text-red-500 text-sm">
                                            {error?.message}
                                        </div>
                                    ))}
                                </>
                            )}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="estimatedCarbs">Estimated Carbohydrates</Label>
                        <form.Field
                            name="estimatedCarbs"
                            children={(field) => (
                                <>
                                    <Input
                                        id="estimatedCarbs"
                                        type='number'
                                        placeholder="Estimated Carbohydrates"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(parseInt(e.target.value))}
                                    />
                                    {field.state.meta.errors.map((error, i) => (
                                        <div key={`${field.name}-error-${i}`} className="text-red-500 text-sm">
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
                            name="mealDate"
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
                    <div className="grid gap-2">
                        <div className='flex items-center justify-between'>
                            <Label htmlFor="notes">Notes</Label>
                            <span className='text-xs text-muted-foreground'>Optional</span>
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
                                        <div key={`${field.name}-error-${i}`} className="text-red-500 text-sm">
                                            {error?.message}
                                        </div>
                                    ))}
                                </>
                            )}
                        />
                    </div>
                </div>
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button type='submit' disabled={!canSubmit || isSubmitting}>
                            {isSubmitting ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Submit'}
                        </Button>
                    )}
                />
            </form>
        </div>
    )
}

export default MealUpload