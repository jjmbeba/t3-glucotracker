import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import SignUpForm from "../forms/sign-up";

export function SignUp() {
	return (
		<Card className="z-50 rounded-md rounded-t-none max-w-md border-0 shadow-none md:border md:shadow">
			<CardHeader>
				<CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
				<CardDescription className="text-xs md:text-sm">
					Enter your information to create an account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<SignUpForm />
			</CardContent>
			<CardFooter>
				<div className="flex justify-center w-full border-t py-4">
					<p className="text-center text-xs text-neutral-500">
						Secured by <span className="text-orange-400">better-auth.</span>
					</p>
				</div>
			</CardFooter>
		</Card>
	);
}