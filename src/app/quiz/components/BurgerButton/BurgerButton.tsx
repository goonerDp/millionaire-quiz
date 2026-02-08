"use client";

import styles from "./BurgerButton.module.scss";

type Props = {
  onClick: () => void;
};

function BurgerButton({ onClick }: Props) {
  return (
    <button
      type="button"
      className={styles.burgerButton}
      onClick={onClick}
      aria-label="Open prize ladder"
    >
      <span className={styles.burgerLine} />
      <span className={styles.burgerLine} />
      <span className={styles.burgerLine} />
    </button>
  );
}

export default BurgerButton;
