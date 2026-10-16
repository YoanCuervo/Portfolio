import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { clientRows } from "../../data/clients";
import { softSkills } from "../../data/softSkills";
import { useReveal } from "../../hooks/useReveal";
import BlurDecor from "../layout/BlurDecor";
import Section from "../layout/Section";
import SectionSubtitle from "../layout/SectionSubtitle";
import SectionTitle from "../layout/SectionTitle";
import IconLink from "../ui/IconLink";
import Pill from "../ui/Pill";
import styles from "./About.module.css";
import Marquee from "./Marquee";

const iconProps = {
  viewBox: "0 0 24 24",
  width: 18,
  height: 18,
  fill: "currentColor",
} as const;

const pauseIcon = (
  <svg {...iconProps} aria-hidden="true">
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);

const playIcon = (
  <svg {...iconProps} aria-hidden="true">
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5z" />
  </svg>
);

export default function About() {
  const { t } = useLanguage();
  const { ref, revealed } = useReveal<HTMLDivElement>("about");
  // Hover alone does not let keyboard and touch users stop the motion (WCAG 2.2.2).
  const [paused, setPaused] = useState(false);

  return (
    <Section id="about" className={styles.about}>
      <BlurDecor
        color="rose"
        size={360}
        right={-120}
        top={-120}
        opacity={[0.2, 0.55]}
      />

      <div className={styles.padded}>
        <SectionTitle id="about-title">{t.about.title}</SectionTitle>
      </div>

      <div className={`${styles.padded} ${styles.columns}`}>
        <div
          ref={ref}
          className={
            revealed ? `${styles.story} ${styles.revealed}` : styles.story
          }
        >
          <p className={styles.hook}>{t.about.hook}</p>
          <p className={styles.paragraph}>{t.about.paragraph}</p>
          <blockquote className={styles.quote}>
            <p>{t.about.quote}</p>
          </blockquote>
        </div>

        <div className={styles.softSkills}>
          <SectionSubtitle>{t.about.softSkillsTitle}</SectionSubtitle>
          <ul className={styles.pills}>
            {softSkills.map((id) => (
              <li key={id}>
                <Pill>{t.about.softSkills[id]}</Pill>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.clients}>
        <SectionSubtitle className={styles.padded}>
          {t.about.clientsTitle}
        </SectionSubtitle>
        <Marquee clients={clientRows[0]} direction="right" paused={paused} />
        <Marquee clients={clientRows[1]} direction="left" paused={paused} />
        <div className={`${styles.padded} ${styles.carouselControl}`}>
          <IconLink
            label={paused ? t.about.playClients : t.about.pauseClients}
            onClick={() => setPaused(!paused)}
          >
            {paused ? playIcon : pauseIcon}
          </IconLink>
        </div>
      </div>
    </Section>
  );
}
