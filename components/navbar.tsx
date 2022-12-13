import Link from "next/link"
import styles from "./navbar.module.css"

import { useState } from 'react'

export default function Navbar() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.navbar}>
        <h1 className={styles.heading}>NEXT-AlGORITHM</h1>

        <button className={styles.menuButton}
          onClick={() => {
            setIsNavExpanded(!isNavExpanded)
          }}
        >
          <div className={
            !isNavExpanded ? 
            styles.menuToggle :
            `${styles.menuToggle} ${styles.expanded}`}></div>
        </button>
        <div className={
          !isNavExpanded ? 
          styles.navigationMenu : 
          `${styles.navigationMenu} ${styles.expanded}`}>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/1">Algo1</Link></li>
            <li><Link href="/2">Algo2</Link></li>
            <li><Link href="/3">Algo3</Link></li>
          </ul>
        </div>
      </div>
    </header>
  )
}