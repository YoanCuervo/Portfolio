import type { ReactNode } from "react";
import styles from "./Section.module.css";

type SectionProps = {
  id: string;
  className?: string;
  children: ReactNode;
};

// The section title must carry the id `${id}-title`.
export default function Section({ id, className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={className ? `${styles.section} ${className}` : styles.section}
    >
      {children}
    </section>
  );
}
