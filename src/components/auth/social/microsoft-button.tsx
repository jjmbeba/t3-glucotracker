import React from 'react'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'

const MicrosoftButton = () => {
    return (
        <Button
            variant="outline"
            className={cn("w-full gap-2")}
        // onClick={async () => {
        //     await signIn.social({
        //         provider: "microsoft",
        //         callbackURL: "/dashboard",
        //     });
        // }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                role='img'
                aria-label='Microsoft logo'
            >
                <path
                    fill="currentColor"
                    d="M2 3h9v9H2zm9 19H2v-9h9zM21 3v9h-9V3zm0 19h-9v-9h9z"
                ></path>
            </svg>
            Sign in with Microsoft
        </Button>
    )
}

export default MicrosoftButton