import { useLanguage } from "../../context/LanguageContext";
import styles from "./Footer.module.css";

export default function Footer({ className }: { className?: string }) {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer
      className={className ? `${styles.footer} ${className}` : styles.footer}
    >
      © {year} {t.meta.name}
    </footer>
  );
}
