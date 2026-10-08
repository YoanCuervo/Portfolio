import type { ReactNode } from "react";
import styles from "./SectionSubtitle.module.css";

type SectionSubtitleProps = {
  className?: string;
  children: ReactNode;
};

export default function SectionSubtitle({
  className,
  children,
}: SectionSubtitleProps) {
  return (
    <h3
      className={
        className ? `${styles.subtitle} ${className}` : styles.subtitle
      }
    >
      {children}
    </h3>
  );
}
