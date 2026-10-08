import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import Hero from "../components/hero/Hero";
import Footer from "../components/layout/Footer";
import Skills from "../components/skills/Skills";
import { useLanguage } from "../context/LanguageContext";
import { scrollToSection } from "../utils/scrollToSection";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Coming from /projects, the Navbar passes the target section in the navigation state.
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (target) {
      scrollToSection(target);
      // Clear the state, otherwise a page reload would scroll again.
      navigate(".", { replace: true, state: null });
    }
  }, [location.state, navigate]);

  // Temporary sections: each one is replaced by its real component in T10 to T12.
  return (
    <main>
      <Hero />
      <Skills />
      <section
        id="projects"
        aria-labelledby="projects-title"
        className={styles.section}
      >
        <h2 id="projects-title">{t.projects.title}</h2>
      </section>
      <section
        id="about"
        aria-labelledby="about-title"
        className={styles.section}
      >
        <h2 id="about-title">{t.about.title}</h2>
      </section>
      <section
        id="contact"
        aria-labelledby="contact-title"
        className={styles.section}
      >
        <h2 id="contact-title">
          {t.contact.titleQuestion} {t.contact.titleInvite}
        </h2>
        <Footer className={styles.footer} />
      </section>
    </main>
  );
}
