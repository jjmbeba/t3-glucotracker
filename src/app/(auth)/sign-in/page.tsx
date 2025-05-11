import SignIn from "~/components/auth/tabs/sign-in";
import { SignUp } from "~/components/auth/tabs/sign-up";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Page() {
    return (
        <div className="w-full">
            <div className="flex items-center flex-col justify-center w-full px-4 py-6 md:py-10">
                <div className="w-full max-w-[400px]">
                    <Tabs defaultValue="sign-in" className="w-full">
                        <TabsList className="w-full">
                            <TabsTrigger value="sign-in" className="flex-1">
                                Sign In
                            </TabsTrigger>
                            <TabsTrigger value="sign-up" className="flex-1">
                                Sign Up
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="sign-in">
                            <SignIn />
                        </TabsContent>
                        <TabsContent value="sign-up">
                            <SignUp />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}