import styles from './Slider.module.scss'
import React, { SetStateAction } from 'react'

export default function Slider({
  label,
  min,
  max,
  value,
  setValue
}: {
  label: string,
  min: number,
  max: number,
  value?: number,
  setValue: React.Dispatch<SetStateAction<number>>
}) {
  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    setValue(parseInt(e.currentTarget.value));
  }

  return (
    <div className={styles.sliderContainer}>
      <label className={styles.sliderLabel}
        htmlFor={label}>{label}</label>
      <input
        className={styles.sliderInput}
        name={label}
        type="range"
        min={min}
        max={max}
        defaultValue={value !== undefined ? value : min}
        step={1}
        onChange={handleChange}
      />
    </div>
  )
}