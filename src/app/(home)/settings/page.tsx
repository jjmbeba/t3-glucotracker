import SettingsCard from '~/components/settings/settings-card'

const Page = () => {
    return (
        <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-3">
                Settings
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 md:mb-8">
                Manage your account settings and preferences
            </p>
            <div className='grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-2'>
                <SettingsCard 
                    title='Profile' 
                    description='Manage your profile information.' 
                    href='/settings/profile' 
                />
                <SettingsCard 
                    title='Medication Management' 
                    description='Manage your medication information.' 
                    href='/settings/medication-management' 
                />
            </div>
        </div>
    )
}

export default Page