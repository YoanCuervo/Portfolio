import { Link } from "react-router";
import { useLanguage } from "../../context/LanguageContext";
import { sectionIds, useSectionNav } from "./sectionNav";
import styles from "./TabBar.module.css";
import TabIcon from "./TabIcon";

export default function TabBar() {
  const { t } = useLanguage();
  const { currentFor, handleClick } = useSectionNav();

  return (
    <nav aria-label={t.nav.label} className={styles.bar}>
      <ul className={styles.tabs}>
        {sectionIds.map((id) => (
          <li key={id} className={styles.item}>
            <Link
              to="/"
              state={{ scrollTo: id }}
              className={styles.tab}
              aria-current={currentFor(id)}
              onClick={(event) => handleClick(event, id)}
            >
              <TabIcon id={id} />
              {t.nav[id]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
