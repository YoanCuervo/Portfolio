import type { MouseEvent } from "react";
import { Link, useLocation } from "react-router";
import frFlag from "../../assets/flags/fr.svg";
import gbFlag from "../../assets/flags/gb.svg";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { scrollToSection } from "../../utils/scrollToSection";
import styles from "./Navbar.module.css";

const sectionIds = ["skills", "projects", "about", "contact"] as const;

const sunIcon = (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const moonIcon = (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

export default function Navbar() {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { lang, t, toggleLang } = useLanguage();

  // On the home page the section is already there: scroll without navigating.
  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (pathname === "/") {
      event.preventDefault();
      scrollToSection(id);
    }
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label={t.nav.label}>
        <Link
          to="/"
          state={{ scrollTo: "home" }}
          className={styles.name}
          onClick={(event) => handleClick(event, "home")}
        >
          {t.meta.name}
        </Link>

        <div className={styles.right}>
          <ul className={styles.links}>
            {sectionIds.map((id) => (
              <li key={id}>
                <Link
                  to="/"
                  state={{ scrollTo: id }}
                  className={styles.link}
                  onClick={(event) => handleClick(event, id)}
                >
                  {t.nav[id]}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.buttons}>
            <button
              type="button"
              className={styles.round}
              onClick={toggleTheme}
              aria-label={
                theme === "dark" ? t.nav.switchToLight : t.nav.switchToDark
              }
            >
              {theme === "dark" ? sunIcon : moonIcon}
            </button>
            <button
              type="button"
              className={styles.round}
              onClick={toggleLang}
              aria-label={t.nav.switchLang}
            >
              <img
                src={lang === "en" ? frFlag : gbFlag}
                alt=""
                width={24}
                height={16}
                className={styles.flag}
              />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
