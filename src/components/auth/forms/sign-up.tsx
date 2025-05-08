"use client"
import { useRouter } from "next/navigation";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { Label } from "~/components/ui/label";

const SignUpForm = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                        id="first-name"
                        placeholder="Max"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                        id="last-name"
                        placeholder="Robinson"
                        required
                    />
                </div>
            </div>
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
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Password"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Confirm Password</Label>
                <Input
                    id="password_confirmation"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm Password"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="image">Profile Image (optional)</Label>
                <div className="flex items-end gap-4">
                    {/* {imagePreview && (
						<div className="relative w-16 h-16 rounded-sm overflow-hidden">
							<Image
								src={imagePreview}
								alt="Profile preview"
								layout="fill"
								objectFit="cover"
							/>
						</div>
					)} */}
                    <div className="flex items-center gap-2 w-full">
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="w-full"
                        />
                        {/* {imagePreview && (
							<X
								className="cursor-pointer"
								onClick={() => {
									setImage(null);
									setImagePreview(null);
								}}
							/>
						)} */}
                    </div>
                </div>
            </div>
            <Button
                type="submit"
                className="w-full"
                disabled={false}
            // onClick={async () => {
            // 	await signUp.email({
            // 		email,
            // 		password,
            // 		name: `${firstName} ${lastName}`,
            // 		image: image ? await convertImageToBase64(image) : "",
            // 		callbackURL: "/dashboard",
            // 		fetchOptions: {
            // 			onResponse: () => {
            // 				setLoading(false);
            // 			},
            // 			onRequest: () => {
            // 				setLoading(true);
            // 			},
            // 			onError: (ctx) => {
            // 				toast.error(ctx.error.message);
            // 			},
            // 			onSuccess: async () => {
            // 				router.push("/dashboard");
            // 			},
            // 		},
            // 	});
            // }}
            >
                {/* {loading ? (
					<Loader2 size={16} className="animate-spin" />
				) : (
					"Create an account"
				)} */}
                Create an account
            </Button>
        </div>
    )
}

async function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default SignUpForm

