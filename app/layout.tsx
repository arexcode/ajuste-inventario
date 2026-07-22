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

// Script anti-parpadeo: aplica la clase de tema (dark/light) al <html> antes
// de que React hidrate, leyendo localStorage o la preferencia del sistema.
// Se renderiza en el <head> del layout (servidor), fuera del árbol de React,
// por eso no dispara el aviso de "script tag" de React 19.
const themeScript = `
(function() {
  try {
    var key = 'theme';
    var stored = localStorage.getItem(key);
    var theme = stored || 'system';
    var isDark = theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  } catch (e) {}
})();
`

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>
          <AuthInit>{children}</AuthInit>
        </Providers>
      </body>
    </html>
  )
}
