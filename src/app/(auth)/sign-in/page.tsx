import SignIn from "~/components/auth/tabs/sign-in";
import { SignUp } from "~/components/auth/tabs/sign-up";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Page() {
    return (
        <div className="w-full">
            <div className="flex items-center flex-col justify-center w-full md:py-10">
                <div className="md:w-[400px]">
                    <Tabs defaultValue="sign-in" className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="sign-in">
                                Sign In
                            </TabsTrigger>
                            <TabsTrigger value="sign-up">
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