import type { CSSProperties } from "react";
import styles from "./AnimatedRole.module.css";

type AnimatedRoleProps = {
  text: string;
  className?: string;
};

// The letters rise one after the other on page load. A screen reader reads the
// hidden full text; the animated letters are hidden from it.
export default function AnimatedRole({ text, className }: AnimatedRoleProps) {
  return (
    <p className={className ? `${styles.role} ${className}` : styles.role}>
      <span className={styles.srOnly}>{text}</span>
      <span aria-hidden="true" className={styles.letters}>
        {[...text].map((char, index) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: the letters never move, so the index is a stable key
            key={index}
            className={styles.letter}
            style={{ "--i": index } as CSSProperties}
          >
            {char}
          </span>
        ))}
      </span>
    </p>
  );
}
