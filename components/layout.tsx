import React from "react"
import Navbar from "./navbar"

import styles from './layout.module.css'

export default function Layout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
    </>
  )
}