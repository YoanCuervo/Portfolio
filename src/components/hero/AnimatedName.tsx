import styles from "./AnimatedName.module.css";

type AnimatedNameProps = {
  id: string;
  text: string;
};

// One span per letter for the entrance animation (T15). The h1 carries the
// whole name so a screen reader reads it as one word, not letter by letter.
export default function AnimatedName({ id, text }: AnimatedNameProps) {
  return (
    <h1 id={id} aria-label={text} className={styles.name}>
      {[...text].map((char, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: the letters never move, so the index is a stable key
          key={index}
          aria-hidden="true"
          className={styles.letter}
        >
          {char}
        </span>
      ))}
    </h1>
  );
}
