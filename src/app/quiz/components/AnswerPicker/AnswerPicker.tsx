"use client";

import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
import styles from "./AnswerPicker.module.scss";

export type AnswerPickerVariant = "selected" | "correct" | "wrong";

export type Props = {
  id: string;
  text: string;
  variant?: AnswerPickerVariant;
  onChange: (id: string) => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "type">;

const buttonStroke = "var(--button-stroke)";
const buttonFill = "var(--button-fill)";

function AnswerPicker({
  id,
  text,
  variant,
  onChange,
  className,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={clsx(
        styles.button,
        variant && styles[variant],
        rest.disabled && styles.disabled,
        className
      )}
      onClick={() => onChange(id)}
      {...rest}
    >
      <svg
        className={styles.svg}
        viewBox="0 0 320 56"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path d="M303 28L320 28" stroke={buttonStroke} />
        <path d="M0 28L17 28" stroke={buttonStroke} />
        <path
          d="M42.1758 0.5H277.824C281.538 0.5 285.024 2.29338 287.183 5.31543L303.385 28L287.183 50.6846C285.024 53.7066 281.538 55.5 277.824 55.5H42.1758C38.4619 55.5 34.9761 53.7066 32.8174 50.6846L16.6143 28L32.8174 5.31543C34.9761 2.29338 38.4619 0.5 42.1758 0.5Z"
          fill={buttonFill}
          stroke={buttonStroke}
        />
      </svg>
      <span className={styles.content}>
        <span className={styles.label}>{id}</span>
        {text}
      </span>
    </button>
  );
}

export default AnswerPicker;
