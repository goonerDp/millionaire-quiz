import clsx from "clsx";
import type { ComponentProps } from "react";
import styles from "./Button.module.scss";

type ButtonProps = ComponentProps<"button">;

function Button({
  children,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(styles.button, className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
