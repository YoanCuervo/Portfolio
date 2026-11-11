import { useLayoutEffect } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router";
import About from "../components/about/About";
import Contact from "../components/contact/Contact";
import Hero from "../components/hero/Hero";
import ProjectsSection from "../components/projects/ProjectsSection";
import Skills from "../components/skills/Skills";
import { scrollToSection } from "../utils/scrollToSection";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  // Coming from /projects, the Navbar and the back link pass the target section in
  // the navigation state. A REPLACE is skipped: "View all projects" stores the
  // target in the current entry just before leaving, for the browser's back button.
  // useLayoutEffect + "instant": the page opens directly on the section, without
  // showing the top of the page first or scrolling through it.
  useLayoutEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (target && navigationType !== "REPLACE") {
      scrollToSection(target, "instant");
      // Clear the state, otherwise a page reload would scroll again.
      navigate(".", { replace: true, state: null });
    }
  }, [location.state, navigationType, navigate]);

  return (
    <main id="main" tabIndex={-1}>
      <Hero />
      <Skills />
      <ProjectsSection />
      <About />
      <Contact />
    </main>
  );
}
