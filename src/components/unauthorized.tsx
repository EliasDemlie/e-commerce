import Link from 'next/link'
import { Button } from '@/components/ui/button2'
import { ShieldAlert, Home, LogIn } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/20 px-4">
      <div className="w-full max-w-md mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full transform -translate-y-1/4 scale-75 animate-pulse" />
            <div className="relative bg-background p-4 rounded-full border border-muted shadow-lg">
              <ShieldAlert
                className="h-16 w-16 text-red-500"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground text-lg">
            You do not have permission to access this page. Please sign in to continue.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              <span>Return Home</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            asChild
            size="lg"
            className="gap-2 shadow-sm hover:shadow-md transition-all"
          >
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
