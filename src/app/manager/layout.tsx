
import { Toaster } from "@/components/ui/toaster"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Manager Dashboard',
  description: 'AI-powered e-commerce manager page',
  keywords: ['e-commerce', 'AI', 'shopping', 'online store'],
}

export default async function ManagerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
       <Toaster/>
      <div>
        {children}
      </div>
    </div>
  )
}
