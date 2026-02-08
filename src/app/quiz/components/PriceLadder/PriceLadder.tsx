"use client";

import clsx from "clsx";
import styles from "./PriceLadder.module.scss";
import { currencyFormatter } from "@/consts";

export type Props = {
  prizes: number[];
  activeIndex: number;
};

const STEP_VIEWBOX = "0 0 376 40";
const leftLinePath = "M69 20H0";
const rightLinePath = "M376 20H307";
const shapePath =
  "M90.2871 0.5H285.713C289.126 0.500018 292.363 2.0158 294.548 4.6377L307.349 20L294.548 35.3623C292.363 37.9842 289.126 39.5 285.713 39.5H90.2871C86.8742 39.5 83.6371 37.9842 81.4521 35.3623L68.6504 20L81.4521 4.6377C83.6371 2.0158 86.8742 0.500017 90.2871 0.5Z";

function PriceLadder({ prizes, activeIndex }: Props) {
  const currentPrize = prizes[activeIndex] ?? prizes[0];
  const orderedPrizes = [...prizes].reverse();

  return (
    <div className={styles.ladder} role="list" aria-label="Prize ladder">
      {orderedPrizes.map((amount) => {
        const isActive = amount === currentPrize;
        const isAnswered = amount < currentPrize;

        return (
          <div
            key={amount}
            className={styles.row}
            role="listitem"
            aria-current={isActive ? "step" : undefined}
          >
            <div
              className={clsx(
                styles.step,
                isActive && styles.stepActive,
                isAnswered && styles.stepAnswered
              )}
            >
              <svg
                className={styles.stepSvg}
                viewBox={STEP_VIEWBOX}
                fill="none"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d={leftLinePath}
                  className={styles.stepStroke}
                  stroke="var(--step-stroke)"
                />
                <path
                  d={rightLinePath}
                  className={styles.stepStroke}
                  stroke="var(--step-stroke)"
                />
                <path
                  d={shapePath}
                  className={styles.stepShape}
                  fill="var(--step-fill)"
                  stroke="var(--step-stroke)"
                />
              </svg>
              <span className={styles.label}>
                {currencyFormatter.format(amount)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PriceLadder;
