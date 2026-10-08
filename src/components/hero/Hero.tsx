import type { ReactNode } from "react";
import { siDiscord, siGithub } from "simple-icons";
import { useLanguage } from "../../context/LanguageContext";
import { type SocialId, socials } from "../../data/socials";
import { scrollToSection } from "../../utils/scrollToSection";
import BlurDecor from "../layout/BlurDecor";
import Section from "../layout/Section";
import IconLink from "../ui/IconLink";
import TechIcon from "../ui/TechIcon";
import AnimatedName from "./AnimatedName";
import styles from "./Hero.module.css";

// LinkedIn is no longer in simple-icons (removed at LinkedIn's request).
const linkedinIcon = (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="currentColor"
    aria-hidden="true"
  >
    <circle cx="5.5" cy="5.5" r="2" />
    <path d="M3.75 9h3.5v11h-3.5zM10 9h3.3v1.5c.6-1 1.9-1.8 3.6-1.8 3.2 0 3.6 2.1 3.6 4.7V20h-3.5v-5.6c0-1.4 0-2.9-1.8-2.9s-1.7 1.4-1.7 2.8V20H10z" />
  </svg>
);

const envelopeIcon = (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const socialIcons: Record<SocialId, ReactNode> = {
  github: <TechIcon icon={siGithub} size={20} />,
  linkedin: linkedinIcon,
  discord: <TechIcon icon={siDiscord} size={20} />,
};

export default function Hero() {
  const { t } = useLanguage();

  return (
    <Section id="home" className={styles.hero}>
      <BlurDecor
        color="amber"
        size={460}
        right={-80}
        top={-110}
        opacity={[0.26, 0.55]}
      />
      <BlurDecor
        color="rose"
        size={300}
        right={160}
        top={70}
        opacity={[0.22, 0.6]}
      />
      <BlurDecor
        color="gold"
        size={400}
        left={-130}
        bottom={-150}
        opacity={[0.24, 0.6]}
      />

      <div className={styles.column}>
        <AnimatedName id="home-title" text={t.meta.name} />

        <div className={styles.body}>
          <p className={styles.role}>{t.hero.role}</p>

          <div className={styles.group}>
            <div className={styles.icons}>
              {socials.map(({ id, url }) =>
                url ? (
                  <IconLink
                    key={id}
                    label={t.hero.links[id]}
                    size="lg"
                    href={url}
                  >
                    {socialIcons[id]}
                  </IconLink>
                ) : (
                  <span key={id} className={styles.missing} aria-hidden="true">
                    {socialIcons[id]}
                  </span>
                ),
              )}
              <IconLink
                label={t.hero.emailMe}
                size="lg"
                onClick={() => scrollToSection("contact")}
              >
                {envelopeIcon}
              </IconLink>
            </div>

            <div className={styles.text}>
              <p>
                {t.hero.greeting}
                <br />
                {t.hero.intro}
              </p>
              <p>{t.hero.background}</p>
              <p>{t.hero.learning}</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
