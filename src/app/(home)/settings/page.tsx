import SettingsCard from '~/components/settings/settings-card'

const Page = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h2 className="page-title">
                Settings
            </h2>
            <p className="text-gray-600 mb-8">
                Manage your account settings and preferences
            </p>
            <div className='grid gap-6 md:grid-cols-2'>
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