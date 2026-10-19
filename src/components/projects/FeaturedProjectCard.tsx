import type { CSSProperties } from "react";
import { useLanguage } from "../../context/LanguageContext";
import type { Project } from "../../data/projects";
import { useReveal } from "../../hooks/useReveal";
import ArrowLink from "../ui/ArrowLink";
import Pill from "../ui/Pill";
import Tag from "../ui/Tag";
import styles from "./FeaturedProjectCard.module.css";

type FeaturedProjectCardProps = {
  project: Project;
  index: number; // position in the entrance cascade
};

// The live-site link sits on the title and its ::after covers the whole card: a
// link can't wrap the card because the GitHub link is inside it. Without a live
// site the card itself takes the focus, so every card stays a Tab stop.
export default function FeaturedProjectCard({
  project,
  index,
}: FeaturedProjectCardProps) {
  const { t } = useLanguage();
  const { ref, revealed } = useReveal<HTMLElement>("projects");
  const text = t.projects.items[project.id];

  const classNames = [styles.card];
  if (project.liveUrl) classNames.push(styles.linked);
  if (revealed) classNames.push(styles.revealed);

  return (
    <article
      ref={ref}
      className={classNames.join(" ")}
      style={{ "--i": index } as CSSProperties}
      tabIndex={project.liveUrl ? undefined : 0}
    >
      <div className={styles.media}>
        {project.screenshot ? (
          <img src={project.screenshot} alt="" className={styles.screenshot} />
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
        <h3 className={styles.title}>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.titleLink}
            >
              {project.title}
              <span className="visually-hidden"> {t.a11y.newTab}</span>
            </a>
          ) : (
            project.title
          )}
        </h3>
        <p className={styles.type}>{text.type}</p>

        <div className={styles.blocks}>
          <div className={styles.block}>
            <h4 className={styles.blockTitle}>{t.projects.theProject}</h4>
            <p className={styles.summary}>{text.summary}</p>
          </div>
          <div className={styles.block}>
            <h4 className={styles.blockTitle}>{t.projects.howBuilt}</h4>
            <p className={styles.summary}>{text.build}</p>
          </div>
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
        {project.repoUrl && (
          <div className={styles.repo}>
            <ArrowLink href={project.repoUrl}>
              {t.projects.repoShort}
              {/* Three links read "GitHub": the project name tells them apart for screen readers. */}
              <span className="visually-hidden"> {project.title}</span>
            </ArrowLink>
          </div>
        )}
      </div>
    </article>
  );
}
