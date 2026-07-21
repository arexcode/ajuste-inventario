"use client"

import { ReactNode } from "react"
import { Provider } from "react-redux"
import { ThemeProvider } from "@/components/theme-provider"
import { store } from "@/lib/store"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  )
}
