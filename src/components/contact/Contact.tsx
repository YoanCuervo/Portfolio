import { useLanguage } from "../../context/LanguageContext";
import { useReveal } from "../../hooks/useReveal";
import BlurDecor from "../layout/BlurDecor";
import Footer from "../layout/Footer";
import Section from "../layout/Section";
import SectionTitle from "../layout/SectionTitle";
import styles from "./Contact.module.css";
import ContactForm from "./ContactForm";

export default function Contact() {
  const { t } = useLanguage();
  const { ref, revealed } = useReveal<HTMLDivElement>("contact");

  return (
    <Section id="contact" className={styles.contact}>
      <BlurDecor
        color="amber"
        size={400}
        left={-140}
        bottom={-120}
        opacity={[0.22, 0.55]}
      />
      <BlurDecor
        color="gold"
        size={300}
        right={-110}
        top={120}
        opacity={[0.18, 0.5]}
      />

      <div
        ref={ref}
        className={
          revealed ? `${styles.center} ${styles.revealed}` : styles.center
        }
      >
        <SectionTitle id="contact-title">
          {t.contact.titleQuestion}{" "}
          <span className={styles.invite}>{t.contact.titleInvite}</span>
        </SectionTitle>
        <ContactForm />
      </div>

      <Footer />
    </Section>
  );
}
