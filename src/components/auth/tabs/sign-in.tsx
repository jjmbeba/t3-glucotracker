import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import SignInForm from "../forms/sign-in";

export default function SignIn() {
    return (
        <Card className="max-w-md rounded-none border-0 shadow-none md:border md:shadow">
            <CardHeader>
                <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SignInForm />
            </CardContent>
            <CardFooter>
                <div className="flex justify-center w-full border-t py-4">
                    <p className="text-center text-xs text-neutral-500">
                        Powered by{" "}
                        <Link
                            href="https://better-auth.com"
                            className="underline"
                            target="_blank"
                        >
                            <span className="dark:text-orange-200/90">better-auth.</span>
                        </Link>
                    </p>
                </div>
            </CardFooter>
        </Card>
    );
}


