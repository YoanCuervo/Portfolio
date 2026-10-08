import { useLanguage } from "../../context/LanguageContext";
import { clientRows } from "../../data/clients";
import { softSkills } from "../../data/softSkills";
import BlurDecor from "../layout/BlurDecor";
import Section from "../layout/Section";
import SectionSubtitle from "../layout/SectionSubtitle";
import SectionTitle from "../layout/SectionTitle";
import Pill from "../ui/Pill";
import styles from "./About.module.css";
import Marquee from "./Marquee";

export default function About() {
  const { t } = useLanguage();

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
        <div className={styles.story}>
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
        <Marquee clients={clientRows[0]} direction="right" />
        <Marquee clients={clientRows[1]} direction="left" />
      </div>
    </Section>
  );
}
