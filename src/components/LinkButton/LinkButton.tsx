import clsx from "clsx";
import Link from "next/link";
import type { ComponentProps } from "react";
import styles from "./LinkButton.module.css";

type LinkButtonProps = ComponentProps<typeof Link>;

function LinkButton({
  href,
  children,
  className,
  ref,
  ...rest
}: LinkButtonProps) {
  return (
    <Link
      ref={ref}
      href={href}
      className={clsx(styles.button, className)}
      {...rest}
    >
      {children}
    </Link>
  );
}

export default LinkButton;
