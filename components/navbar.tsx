import Link from "next/link"
import styles from "./navbar.module.scss"

import { Dispatch, SetStateAction, useState } from 'react'

export default function Navbar({ 
  setTheme 
}: {
  setTheme: Dispatch<SetStateAction<string>>
}) {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  function handleThemeChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.target.checked ? setTheme('dark') : setTheme('light');
  }

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

        <label className={styles.toggleSwitch} >
          <input type="checkbox" onChange={handleThemeChange}/>
          <span className={styles.toggle}></span>
        </label>
      </div>
    </header>
  )
}