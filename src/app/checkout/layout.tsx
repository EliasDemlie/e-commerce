
import { Toaster } from "@/components/ui/toaster"


export default async function CarrierLayout({
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
