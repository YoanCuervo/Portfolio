import { useLanguage } from "../../context/LanguageContext";
import { certifications } from "../../data/certifications";
import { stack } from "../../data/skills";
import BlurDecor from "../layout/BlurDecor";
import Section from "../layout/Section";
import SectionTitle from "../layout/SectionTitle";
import CertificationItem from "./CertificationItem";
import styles from "./Skills.module.css";
import StackRow from "./StackRow";

export default function Skills() {
  const { t } = useLanguage();

  return (
    <Section id="skills" className={styles.skills}>
      <BlurDecor
        color="rose"
        size={360}
        right={-130}
        bottom={-140}
        opacity={[0.2, 0.55]}
      />

      <SectionTitle id="skills-title">{t.skills.title}</SectionTitle>

      <div className={styles.columns}>
        <div className={styles.stack}>
          <h3 className={styles.subtitle}>{t.skills.stackTitle}</h3>
          {stack.map((row) => (
            <StackRow key={row.id} row={row} />
          ))}
        </div>

        <div className={styles.certifications}>
          <h3 className={styles.subtitle}>{t.skills.certificationsTitle}</h3>
          {certifications.map((certification) => (
            <CertificationItem
              key={certification.id}
              certification={certification}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
