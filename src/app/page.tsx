import { Suspense } from "react";
import { HydrateClient } from "~/trpc/server";
import { SignInButton } from "../components/auth/sign-in-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Droplet, LineChart, Clock, Pill, Loader2 } from "lucide-react";

export default async function Home() {
	const features = [
		{
			title: "Glucose Tracking",
			description: "Monitor your blood glucose levels with detailed logs and trends",
			icon: Droplet,
		},
		{
			title: "Meal Logging",
			description: "Track your meals and their impact on your glucose levels",
			icon: Clock,
		},
		{
			title: "Medication Management",
			description: "Keep track of your medications and their schedules",
			icon: Pill,
		},
		{
			title: "Analytics & Reports",
			description: "Get insights into your glucose patterns and trends",
			icon: LineChart,
		},
	];

	return (
		<HydrateClient>
			<div className="min-h-screen flex items-center justify-center py-12 px-6 md:px-0">
				<main className="flex flex-col gap-8 items-center justify-center max-w-4xl w-full">
					<div className="flex flex-col gap-4 text-center">
						<div className="flex items-center justify-center gap-2">
							<Droplet className="w-8 h-8 text-primary" />
							<h1 className="font-bold text-3xl md:text-5xl text-black dark:text-white">
								GlucoTrack
							</h1>
						</div>
						<p className="text-base md:text-lg text-muted-foreground max-w-2xl">
							Your comprehensive diabetes management companion. Track, analyze, and take control of your health journey.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
						{features.map((feature) => (
							<Card key={feature.title} className="hover:shadow-lg transition-shadow">
								<CardHeader>
									<div className="flex items-center gap-2">
										<feature.icon className="w-5 h-5 text-primary" />
										<CardTitle>{feature.title}</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-sm">
										{feature.description}
									</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>

					<div className="flex flex-col items-center gap-4 pt-4">
						<Suspense fallback={<Loader2 className="w-4 h-4 animate-spin" />}>
							<SignInButton />
						</Suspense>
						<p className="text-sm text-muted-foreground text-center">
							Join thousands of users managing their diabetes with confidence
						</p>
					</div>
				</main>
			</div>
		</HydrateClient>
	);
}