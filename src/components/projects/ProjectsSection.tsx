import { Link, useNavigate } from "react-router";
import { useLanguage } from "../../context/LanguageContext";
import { projects } from "../../data/projects";
import BlurDecor from "../layout/BlurDecor";
import Section from "../layout/Section";
import SectionTitle from "../layout/SectionTitle";
import FeaturedProjectCard from "./FeaturedProjectCard";
import styles from "./ProjectsSection.module.css";

export default function ProjectsSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const featured = projects.filter((project) => project.featured);

  // Stores the target in the current history entry before leaving: the browser's
  // back button from /projects then lands on this section (HomePage reads the
  // state), not at the top of the page.
  function rememberSection() {
    navigate(".", { replace: true, state: { scrollTo: "projects" } });
  }

  return (
    <Section id="projects" className={styles.projects}>
      <BlurDecor
        color="amber"
        size={380}
        left={-150}
        top={-130}
        opacity={[0.2, 0.5]}
      />

      <SectionTitle id="projects-title">{t.projects.title}</SectionTitle>

      <div className={styles.cards}>
        {featured.map((project, index) => (
          <FeaturedProjectCard
            key={project.id}
            project={project}
            index={index}
          />
        ))}
      </div>

      <Link to="/projects" onClick={rememberSection} className={styles.viewAll}>
        {t.projects.viewAll}
      </Link>
    </Section>
  );
}
