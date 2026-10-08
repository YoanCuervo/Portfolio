import type { ReactNode } from "react";
import styles from "./Tag.module.css";

type TagProps = {
  children: ReactNode;
  dashed?: boolean;
};

export default function Tag({ children, dashed = false }: TagProps) {
  return (
    <span className={dashed ? `${styles.tag} ${styles.dashed}` : styles.tag}>
      {children}
    </span>
  );
}
