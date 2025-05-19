'use client'

import { Construction, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useSession } from "~/lib/auth-client";

export default function NotFound() {
  const { data: session, isPending } = useSession()

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="flex items-center gap-2">
          <Construction className="w-8 h-8 text-primary" />
          <h1 className="font-bold text-3xl text-primary">
            Under Construction
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          We're working hard to bring you this feature. Please check back soon!
        </p>
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Button asChild>
            <Link href={session?.session ? "/dashboard" : "/"}>
              Return {session?.session ? "To Dashboard" : "Home"}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
} 