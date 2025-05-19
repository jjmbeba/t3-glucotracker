import { Construction } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "~/auth";
import { Button } from "~/components/ui/button";

export default async function NotFound() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="flex items-center gap-2">
          <Construction className="w-8 h-8 text-primary" />
          <h1 className="font-bold text-4xl text-black dark:text-white">
            Under Construction
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          We're working hard to bring you this feature. Please check back soon!
        </p>
        <Button asChild>
          <Link href={session?.session ? "/dashboard" : "/"}>
            Return {session?.session ? "To Dashboard" : "Home"}
          </Link>
        </Button>
      </div>
    </div>
  );
} 