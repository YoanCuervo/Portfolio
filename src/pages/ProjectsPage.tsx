import Footer from "../components/layout/Footer";
import { useLanguage } from "../context/LanguageContext";
import styles from "./ProjectsPage.module.css";

// Temporary page: the project list comes with T14.
export default function ProjectsPage() {
  const { t } = useLanguage();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>{t.projectsPage.title}</h1>
      </main>
      <Footer className={styles.footer} />
    </div>
  );
}
