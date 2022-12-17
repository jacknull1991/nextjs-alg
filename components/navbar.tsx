import Link from "next/link"
import styles from "./navbar.module.scss"

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
            <li><Link href="/sorting">Sorting</Link></li>
            <li><Link href="/graphs">Graphs</Link></li>
          </ul>
        </div>
      </div>
    </header>
  )
}