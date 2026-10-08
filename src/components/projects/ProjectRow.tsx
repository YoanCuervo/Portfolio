import { useLanguage } from "../../context/LanguageContext";
import type { Project } from "../../data/projects";
import ArrowLink from "../ui/ArrowLink";
import Pill from "../ui/Pill";
import Tag from "../ui/Tag";
import ProjectCard from "./ProjectCard";
import styles from "./ProjectRow.module.css";

type ProjectRowProps = {
  project: Project;
  // 3 on the home page (under the "Projects" h2), 2 on /projects (under the page h1).
  headingLevel: 2 | 3;
};

export default function ProjectRow({ project, headingLevel }: ProjectRowProps) {
  const { t } = useLanguage();
  const BlockTitle = headingLevel === 2 ? "h3" : "h4";
  const text = t.projects.items[project.id];

  return (
    <article className={styles.row}>
      <ProjectCard project={project} headingLevel={headingLevel} />

      <div className={styles.details}>
        <div className={styles.meta}>
          {project.stack.length > 0 && (
            <ul className={styles.stack}>
              {project.stack.map((name) => (
                <li key={name}>
                  <Pill size="sm">{name}</Pill>
                </li>
              ))}
            </ul>
          )}
          {project.team && <Tag>{t.projects.team[project.team]}</Tag>}
        </div>

        <div className={styles.blocks}>
          <div className={styles.block}>
            <BlockTitle className={styles.blockTitle}>
              {t.projects.theProject}
            </BlockTitle>
            <p className={styles.summary}>{text.summary}</p>
            {project.repoUrl && (
              <div>
                <ArrowLink href={project.repoUrl}>
                  {t.projects.viewRepo}
                </ArrowLink>
              </div>
            )}
          </div>
          <div className={styles.block}>
            <BlockTitle className={styles.blockTitle}>
              {t.projects.howBuilt}
            </BlockTitle>
            <p className={styles.summary}>{text.build}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
