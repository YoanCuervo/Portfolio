import type { ReactNode } from "react";
import type { SimpleIcon } from "simple-icons";
import styles from "./Pill.module.css";
import TechIcon from "./TechIcon";

type PillProps = {
  children: ReactNode;
  size?: "md" | "sm";
  dashed?: boolean;
  icon?: SimpleIcon;
};

export default function Pill({
  children,
  size = "md",
  dashed = false,
  icon,
}: PillProps) {
  const classes = [styles.pill, styles[size], dashed && styles.dashed]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes}>
      {icon && size === "md" && (
        <TechIcon icon={icon} size={18} className={styles.icon} />
      )}
      {children}
    </span>
  );
}
