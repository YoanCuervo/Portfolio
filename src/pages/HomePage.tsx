import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import About from "../components/about/About";
import Contact from "../components/contact/Contact";
import Hero from "../components/hero/Hero";
import ProjectsSection from "../components/projects/ProjectsSection";
import Skills from "../components/skills/Skills";
import { scrollToSection } from "../utils/scrollToSection";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Coming from /projects, the Navbar passes the target section in the navigation state.
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (target) {
      scrollToSection(target);
      // Clear the state, otherwise a page reload would scroll again.
      navigate(".", { replace: true, state: null });
    }
  }, [location.state, navigate]);

  return (
    <main>
      <Hero />
      <Skills />
      <ProjectsSection />
      <About />
      <Contact />
    </main>
  );
}
