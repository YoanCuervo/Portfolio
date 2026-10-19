import { useEffect } from "react";
import { Link } from "react-router";
import BlurDecor from "../components/layout/BlurDecor";
import Footer from "../components/layout/Footer";
import ProjectRow from "../components/projects/ProjectRow";
import { useLanguage } from "../context/LanguageContext";
import { projects } from "../data/projects";
import styles from "./ProjectsPage.module.css";

export default function ProjectsPage() {
  const { t } = useLanguage();

  // HashRouter keeps the previous scroll position: coming from the bottom of the
  // home page, this page would open already scrolled. "instant" skips the smooth scroll.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className={styles.page}>
      <BlurDecor
        color="amber"
        size={420}
        right={-110}
        top={-130}
        opacity={[0.24, 0.55]}
      />
      <BlurDecor
        color="rose"
        size={380}
        left={-140}
        bottom={-140}
        opacity={[0.18, 0.55]}
      />

      <main id="main" tabIndex={-1} className={styles.main}>
        <Link to="/" state={{ scrollTo: "projects" }} className={styles.back}>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t.projectsPage.backToHome}
        </Link>

        <h1 className={styles.title}>{t.projectsPage.title}</h1>

        {projects.map((project, index) => (
          <ProjectRow
            key={project.id}
            project={project}
            headingLevel={2}
            index={index}
          />
        ))}
      </main>

      <Footer className={styles.footer} />
    </div>
  );
}
