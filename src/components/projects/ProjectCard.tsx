import { useLanguage } from "../../context/LanguageContext";
import type { Project } from "../../data/projects";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  project: Project;
  headingLevel: 2 | 3;
};

// The whole card links to the live site. Without a live site it is a div, kept in
// the Tab order on Yoan's request so keyboard users still stop on every card.
export default function ProjectCard({
  project,
  headingLevel,
}: ProjectCardProps) {
  const { t } = useLanguage();
  const Title = headingLevel === 2 ? "h2" : "h3";

  const content = (
    <>
      {project.screenshot ? (
        <span className={styles.shot}>
          <img src={project.screenshot} alt="" className={styles.screenshot} />
        </span>
      ) : (
        <div className={styles.placeholder}>
          {t.projects.screenshotPlaceholder}
        </div>
      )}
      <div className={styles.text}>
        <Title className={styles.title}>{project.title}</Title>
        <p className={styles.type}>{t.projects.items[project.id].type}</p>
      </div>
    </>
  );

  if (project.liveUrl) {
    return (
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.card} ${styles.link}`}
      >
        {content}
        <span className="visually-hidden">{t.a11y.newTab}</span>
      </a>
    );
  }

  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: the card must be reachable with Tab even without a live link
    <div className={styles.card} tabIndex={0}>
      {content}
    </div>
  );
}
