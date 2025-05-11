import Link from 'next/link'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { cn } from '~/lib/utils'

const SettingsCard = ({ title, description, href }: { title: string, description: string, href: string }) => {
    return (
        <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6">
            <CardHeader className="flex-1 p-0">
                <CardTitle className="text-base sm:text-lg break-words">{title}</CardTitle>
                <CardDescription className="text-sm break-words">{description}</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-shrink-0">
                <Link href={href} className={cn(buttonVariants({ variant: 'outline' }), 'whitespace-nowrap')}>
                    Go to {title}
                </Link>
            </CardContent>
        </Card>
    )
}

export default SettingsCard