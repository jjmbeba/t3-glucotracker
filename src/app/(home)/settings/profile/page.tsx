import PersonalInformation from '~/components/profile/forms/personal-info'
import ProfileImage from '~/components/profile/forms/profle-image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

const ProfilePage = () => {
  return (
    <div>
      <h2 className='page-title'>
        Profile
      </h2>
      <div className='grid grid-cols-1 gap-4 mt-4'>
        <Card>
          <CardHeader>
            <CardTitle>
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PersonalInformation />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              Profile Image
            </CardTitle>
            <CardDescription>
              Update your profile image.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileImage />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProfilePage