import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import SocialSignIn from './social'


const SignInForm = () => {
    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                />
            </div>

            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                        Forgot your password?
                    </Link>
                </div>

                <Input
                    id="password"
                    type="password"
                    placeholder="password"
                    autoComplete="password"
                />
            </div>

            <div className="flex items-center gap-2">
                <Checkbox
                    id="remember"
                />
                <Label htmlFor="remember">Remember me</Label>
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={false}
            // onClick={async () => {
            //     await signIn.email({ email, password });
            // }}
            >
                {/* {loading ? <Loader2 size={16} className="animate-spin" /> : "Login"} */}
                Login
            </Button>
            <SocialSignIn />
        </div>
    )
}

export default SignInForm