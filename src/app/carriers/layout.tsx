
import { ToastProvider } from "@radix-ui/react-toast"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Carrier Dashboard',
  description: 'AI-powered e-commerce carrier page',
  keywords: ['e-commerce', 'AI', 'shopping', 'online store'],
}

export default async function CarrierLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
       <ToastProvider/>
      <div>
        {children}
      </div>
    </div>
  )
}
