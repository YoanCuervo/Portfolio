import { useLanguage } from "../../context/LanguageContext";
import { certifications } from "../../data/certifications";
import { stack } from "../../data/skills";
import { useReveal } from "../../hooks/useReveal";
import BlurDecor from "../layout/BlurDecor";
import Section from "../layout/Section";
import SectionSubtitle from "../layout/SectionSubtitle";
import SectionTitle from "../layout/SectionTitle";
import CertificationItem from "./CertificationItem";
import styles from "./Skills.module.css";
import StackRow from "./StackRow";

export default function Skills() {
  const { t } = useLanguage();
  const { ref, revealed } = useReveal<HTMLDivElement>();

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

      <div ref={ref} className={styles.columns}>
        <div className={styles.stack}>
          <SectionSubtitle>{t.skills.stackTitle}</SectionSubtitle>
          {stack.map((row, index) => (
            <StackRow
              key={row.id}
              row={row}
              index={index}
              revealed={revealed}
            />
          ))}
        </div>

        <div className={styles.certifications}>
          <SectionSubtitle>{t.skills.certificationsTitle}</SectionSubtitle>
          {/* The certifications follow the stack rows in the same cascade. */}
          {certifications.map((certification, index) => (
            <CertificationItem
              key={certification.id}
              certification={certification}
              index={stack.length + index}
              revealed={revealed}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
