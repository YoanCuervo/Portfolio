import type { CSSProperties } from "react";
import { useReveal } from "../../hooks/useReveal";
import styles from "./AnimatedRole.module.css";

type AnimatedRoleProps = {
  text: string;
  className?: string;
};

// The letters rise one after the other when the hero is on screen: on page load,
// and again when the Navbar takes the visitor back to the top. A screen reader
// reads the hidden full text; the animated letters are hidden from it.
export default function AnimatedRole({ text, className }: AnimatedRoleProps) {
  const { ref, revealed } = useReveal<HTMLParagraphElement>("home");
  const classes = [styles.role, revealed && styles.revealed, className]
    .filter(Boolean)
    .join(" ");

  return (
    <p ref={ref} className={classes}>
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
