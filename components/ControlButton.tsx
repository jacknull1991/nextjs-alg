import styles from "./ControlButton.module.scss"

export default function ControlButton({
  text,
  action,
  active,
  disabled
}: {
  text: string,
  action: () => void,
  active?: boolean,
  disabled?: boolean
}) {
  return (
    <button className={
      active === true ?
        `${styles.controlButton} ${styles.active}` :
        styles.controlButton}
      onClick={action}
      disabled={disabled}>
      {text}
    </button>
  )
}