"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import styles from "./Popup.module.scss";

export type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

function Popup({ open, onClose, title, children }: Props) {
  return (
    <div
      className={clsx(styles.overlay, open && styles.overlayOpen)}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      aria-hidden={!open}
      inert={open ? undefined : true}
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
