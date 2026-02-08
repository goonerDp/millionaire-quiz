"use client";

import type { ReactNode } from "react";
import styles from "./Popup.module.scss";

export type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

function Popup({ open, onClose, title, children }: Props) {
  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.panel}>
        <div className={styles.header}>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Popup;
