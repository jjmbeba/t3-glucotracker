import dayjs from 'dayjs'
import { GlucoseHistoryChart } from '~/components/charts/glucose/glucose-history'
import QuickAddButton from '~/components/common/quick-add-button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { ChartConfig } from '~/components/ui/chart'
import { api } from '~/trpc/server'

const chartConfig = {
  glucose: {
    label: "Glucose",
    color: "hsl(var(--chart-5))",
  }
} satisfies ChartConfig

const DashboardPage = async () => {
  const glucoseLogs = await api.glucose.getLogs()
  const glucoseTargets = await api.glucose.getTargets()

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className='flex sm:flex-row sm:items-center justify-between gap-4'>
        <h1 className='page-title'>Dashboard</h1>
        <div>
          <QuickAddButton />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="grid grid-rows-2 gap-4 h-full">
          <LastGlucoseLog />
          <LastMedicationLog />
        </div>
        <GlucoseHistoryChart className="lg:col-span-2 h-full" glucoseLogs={glucoseLogs} chartConfig={chartConfig} glucoseTargets={glucoseTargets} />
      </div>
    </div>
  )
}

const LastGlucoseLog = async () => {
  const lastGlucoseLog = await api.glucose.getLastLog()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            Last Glucose Log
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lastGlucoseLog[0] ? (<div className="flex flex-col items-center justify-center">
          <div>
            <span className='text-5xl sm:text-6xl font-bold'>
              {lastGlucoseLog[0].glucose}
            </span>
            <span className='text-xl sm:text-2xl font-bold'>
              mg/dL
            </span>
          </div>
          <span className='text-sm text-muted-foreground'>
            {dayjs(lastGlucoseLog[0].date).format('DD MMM YYYY HH:mm')} - {lastGlucoseLog[0].glucose > 144 ? 'High' : lastGlucoseLog[0].glucose < 72 ? 'Low' : 'Normal'}
          </span>
        </div>) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground">No glucose logs found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const LastMedicationLog = async () => {
  const lastMedicationLog = await api.medication.getLastLog()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            Last Medication Log
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lastMedicationLog[0] ? (
          <div className="flex flex-col items-center justify-center">
            <div className="text-center">
              <span className='text-xl sm:text-2xl font-bold'>
                {lastMedicationLog[0]?.medication?.name}
              </span>
              <div className="mt-2">
                <span className='text-3xl sm:text-4xl font-bold'>
                  {lastMedicationLog[0].dosageAmountTaken}
                </span>
                <span className='text-lg sm:text-xl font-bold ml-1'>
                  {lastMedicationLog[0].dosageUnitTaken}
                </span>
              </div>
              {lastMedicationLog[0]?.medication?.strength && (
                <span className='text-sm text-muted-foreground block mt-1'>
                  {lastMedicationLog[0].medication.strength}
                </span>
              )}
            </div>
            <span className='text-sm text-muted-foreground mt-2'>
              {dayjs(lastMedicationLog[0].createdAt).format('DD MMM YYYY HH:mm')}
            </span>
            {lastMedicationLog[0].notes && (
              <span className='text-sm text-muted-foreground mt-1 text-center'>
                {lastMedicationLog[0].notes}
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground">No medication logs found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DashboardPage