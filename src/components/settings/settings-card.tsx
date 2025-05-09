import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { cn } from '~/lib/utils'
import { buttonVariants } from '~/components/ui/button'
import Link from 'next/link'

const SettingsCard = ({ title, description, href }: { title: string, description: string, href: string }) => {
    return (
        <Card className='flex flex-row items-center justify-between'>
            <CardHeader className='flex-1'>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href={href} className={cn(buttonVariants({ variant: 'outline' }))}>
                    Go to {title}
                </Link>
            </CardContent>
        </Card>
    )
}

export default SettingsCard