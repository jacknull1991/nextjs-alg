import React, { SetStateAction, useRef } from "react"
import Draggable from "react-draggable"
import ControlButton from "./ControlButton"
import styles from './Modal.module.scss'

export default function Modal({
  show,
  setShow,
  title,
  children
}: {
  show: boolean,
  setShow: React.Dispatch<SetStateAction<boolean>>
  title: string,
  children?: React.ReactNode
}) {
  function handleClose() {
    setShow(false);
  }

  const nodeRef = useRef(null);

  if (show) {
    return (
      <Draggable nodeRef={nodeRef}>
        <div ref={nodeRef} className={styles.modal}>
          <h2>{title}</h2>
          <div className={styles.content}>
            {children}
          </div>
          <div className={styles.actions}>
            <ControlButton text="OK" action={handleClose} active={true} />
          </div>
        </div>
      </Draggable>
    )
  } else {
    return <></>
  }
}