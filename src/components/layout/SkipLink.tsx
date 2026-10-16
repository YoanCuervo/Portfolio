import { useLanguage } from "../../context/LanguageContext";
import styles from "./SkipLink.module.css";

// A button, not a link: with HashRouter, href="#main" would change the route.
// It moves the focus to <main>, so the next Tab starts inside the page content.
export default function SkipLink() {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      className={styles.skip}
      onClick={() => document.getElementById("main")?.focus()}
    >
      {t.a11y.skipLink}
    </button>
  );
}
