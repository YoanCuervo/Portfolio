import { useLanguage } from "../../context/LanguageContext";
import BlurDecor from "../layout/BlurDecor";
import Footer from "../layout/Footer";
import Section from "../layout/Section";
import SectionTitle from "../layout/SectionTitle";
import styles from "./Contact.module.css";
import ContactForm from "./ContactForm";

export default function Contact() {
  const { t } = useLanguage();

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

      <div className={styles.center}>
        <SectionTitle id="contact-title">
          {t.contact.titleQuestion}{" "}
          <span className={styles.invite}>{t.contact.titleInvite}</span>
        </SectionTitle>
        <p className={styles.intro}>{t.contact.intro}</p>
        <ContactForm />
      </div>

      <Footer />
    </Section>
  );
}
