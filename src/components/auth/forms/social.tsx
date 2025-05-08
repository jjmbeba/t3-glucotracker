import { cn } from "~/lib/utils"

import GithubButton from "../social/github-button"
import GoogleButton from "../social/google-button"
import MicrosoftButton from "../social/microsoft-button"

const SocialSignIn = () => {
    return (
        <div
            className={cn(
                "w-full gap-2 flex items-center",
                "justify-between flex-col",
            )}
        >
            <GoogleButton />
            <GithubButton />
            <MicrosoftButton />
        </div>
    )
}


export default SocialSignIn