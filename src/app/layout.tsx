import SessionProvider from '@/components/auth/SessionProvider'
import './globals.css'
import Footer from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import { CartContextProvider } from '@/hooks/useCart'
import { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { NotificationProvider } from '@/provider/NotificationProvider'


export const metadata: Metadata = {
  title: 'Gulit Gebeya',
  description: 'AI-powered e-commerce web app',
  keywords: ['e-commerce', 'AI', 'shopping', 'online store'],
  authors: [
    { name: 'Henok Worku', url: 'https://github.com/henokworkuliyew' },
    { name: 'Elias Demlie', url: 'https://github.com/EliasDemlie' },
    { name: 'Samrawit Solomon', url: 'https://github.com/henokworkuliyew' },
  ],
  openGraph: {
    title: 'Gulit Gebeya',
    description: 'AI-powered e-commerce web app',
    images: ['https://yourwebsite.com/og-image.jpg'],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <NotificationProvider>
          <Toaster
            toastOptions={{
              style: {
                background: 'rgb(51 65 85)',
                color: '#fff',
              },
            }}
          />
          <SessionProvider>
            <CartContextProvider>
              <Header />
              <main className="flex-grow pt-24">{children}</main>
              <Footer />
            </CartContextProvider>
          </SessionProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}
