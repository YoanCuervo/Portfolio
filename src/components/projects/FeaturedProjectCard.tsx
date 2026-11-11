import { type CSSProperties, useId } from "react";
import { Link } from "react-router";
import { useLanguage } from "../../context/LanguageContext";
import type { Project } from "../../data/projects";
import { useReveal } from "../../hooks/useReveal";
import Pill from "../ui/Pill";
import Tag from "../ui/Tag";
import styles from "./FeaturedProjectCard.module.css";

type FeaturedProjectCardProps = {
  project: Project;
  index: number; // column, 0 to 2
};

export default function FeaturedProjectCard({
  project,
  index,
}: FeaturedProjectCardProps) {
  const { t } = useLanguage();
  const { ref, revealed } = useReveal<HTMLElement>("projects");
  const text = t.projects.items[project.id];
  // The link wraps the whole card: its name is the title alone, not all the
  // card's text. useId because each card is rendered twice (grid and carousel).
  const titleId = useId();

  // Fan entrance for the three cards: the middle one (index 1) comes first, then
  // the side ones slide out from the centre.
  const entrance = {
    "--i": Math.abs(index - 1),
    "--shift": 1 - index,
  } as CSSProperties;

  return (
    <article
      ref={ref}
      className={revealed ? `${styles.card} ${styles.revealed}` : styles.card}
      style={entrance}
    >
      <Link
        to="/projects"
        state={{ scrollTo: project.id }}
        className={styles.link}
        aria-labelledby={titleId}
        // Dragging a link with the mouse starts the browser's drag and drop,
        // which cancels the carousel swipe.
        draggable={false}
      >
        <div className={styles.media}>
          {project.screenshot ? (
            <img
              src={project.screenshot}
              alt=""
              className={styles.screenshot}
            />
          ) : (
            <div className={styles.placeholder}>
              {t.projects.screenshotPlaceholder}
            </div>
          )}
        </div>

        {project.team && (
          <div className={styles.team}>
            <Tag>{t.projects.team[project.team]}</Tag>
          </div>
        )}

        <div className={styles.body}>
          <h3 id={titleId} className={styles.title}>
            {project.title}
          </h3>
          <p className={styles.type}>{text.type}</p>

          <div className={styles.block}>
            <h4 className={styles.blockTitle}>{t.projects.theProject}</h4>
            <p className={styles.summary}>{text.summary}</p>
          </div>

          {project.stack.length > 0 && (
            <ul className={styles.stack}>
              {project.stack.map((name) => (
                <li key={name}>
                  <Pill size="sm">{name}</Pill>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </article>
  );
}
