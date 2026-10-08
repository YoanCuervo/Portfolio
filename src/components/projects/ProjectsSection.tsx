import { Link } from "react-router";
import { useLanguage } from "../../context/LanguageContext";
import { projects } from "../../data/projects";
import BlurDecor from "../layout/BlurDecor";
import Section from "../layout/Section";
import SectionTitle from "../layout/SectionTitle";
import ProjectRow from "./ProjectRow";
import styles from "./ProjectsSection.module.css";

export default function ProjectsSection() {
  const { t } = useLanguage();
  const featured = projects.filter((project) => project.featured);

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

      {featured.map((project) => (
        <ProjectRow key={project.id} project={project} headingLevel={3} />
      ))}

      <Link to="/projects" className={styles.viewAll}>
        {t.projects.viewAll}
      </Link>
    </Section>
  );
}
