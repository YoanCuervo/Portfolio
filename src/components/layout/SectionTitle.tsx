import type { ReactNode } from "react";
import styles from "./SectionTitle.module.css";

type SectionTitleProps = {
  id: string;
  children: ReactNode;
};

export default function SectionTitle({ id, children }: SectionTitleProps) {
  return (
    <h2 id={id} className={styles.title}>
      {children}
    </h2>
  );
}
