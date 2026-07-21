import { Geist, Geist_Mono, Roboto } from "next/font/google"

import "./globals.css"
import { Providers } from "@/components/providers"
import { AuthInit } from "@/components/auth-init"
import { cn } from "@/lib/utils"

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", roboto.variable)}
    >
      <body>
        <Providers>
          <AuthInit>{children}</AuthInit>
        </Providers>
      </body>
    </html>
  )
}
