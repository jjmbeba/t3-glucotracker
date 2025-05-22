'use client'

import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import dayjs from 'dayjs'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { TimePicker } from '~/components/ui/time-picker'
import { toISOStringWithTimezone } from '~/lib/time-picker-utils'
import { cn } from '~/lib/utils'
import { mealUploadSchema } from '~/schemas/meal'
import { api } from '~/trpc/react'

type CreateProps = {
    type: 'create',
}

type UpdateProps = {
    type: 'update',
    id: number,
    defaultValues: z.infer<typeof mealUploadSchema>
}

type Props = CreateProps | UpdateProps

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
const MealLogForm = ({ type, ...props }: Props) => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const queryKey = getQueryKey(api.meal.getLogs, undefined, 'query')

    const { mutate: uploadMeal, isPending } = api.meal.upload.useMutation({
        onSuccess: () => {
            toast.success("Meal uploaded successfully")
            form.reset()
            router.refresh()
        },
        onError: (error) => {
            toast.error(error.message)
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey
            })
        }
    })

    const { mutate: updateMeal, isPending: isUpdatePending } = api.meal.updateLog.useMutation({
        onSuccess: () => {
            toast.success("Meal updated successfully")
            form.reset()
            router.refresh()
        },
        onError: (error) => {
            toast.error(error.message)
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey
            })
        }
    })

    const form = useForm({
        defaultValues: type === 'update' && 'defaultValues' in props ? mealUploadSchema.parse(props.defaultValues) : {
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
            if (type === 'create') {
                uploadMeal(value)
            } else {
                updateMeal({
                    ...value,
                    id: 'id' in props ? props.id : 0
                })
            }
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
                        <Button className='mt-4' type='submit' disabled={!canSubmit || isSubmitting || isPending || isUpdatePending}>
                            {isSubmitting || isPending || isUpdatePending ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Submit'}
                        </Button>
                    )}
                />
            </form>
        </div>
    )
}

export default MealLogForm