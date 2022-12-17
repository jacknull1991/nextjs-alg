import styles from './VerticalBar.module.scss'

export default function VerticalBar({ 
  height,
  backgroundColor
}: {
  height: number,
  backgroundColor: string
}) {
  return (
    <div className={styles.verticalBar} style={{
      height: `${height}px`,
      backgroundColor: backgroundColor
    }}>
    </div>
  )
}