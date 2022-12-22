import React, { useState } from "react"
import Navbar from "./navbar"

export default function Layout({
  children
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState('light');

  return (
    <div data-theme={theme}>
      <Navbar setTheme={setTheme}/>
      <main>
        {children}
      </main>
    </div>
  )
}