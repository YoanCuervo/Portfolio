import type { MouseEvent } from "react";
import { useLocation } from "react-router";
import { useActiveSection } from "../../hooks/useActiveSection";
import { scrollToSection } from "../../utils/scrollToSection";

export const sectionIds = ["skills", "projects", "about", "contact"] as const;

export type SectionId = (typeof sectionIds)[number];

// Shared by the Navbar (desktop) and the TabBar (mobile): same links, same
// active state, same scroll.
export function useSectionNav() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const activeSection = useActiveSection(isHome);

  // On /projects, the Projects link names the current page; on the home page,
  // the link of the section on screen names the current location.
  function currentFor(id: SectionId) {
    if (pathname === "/projects" && id === "projects") {
      return "page";
    }
    return isHome && activeSection === id ? "location" : undefined;
  }

  // On the home page the section is already there: scroll without navigating.
  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (isHome) {
      event.preventDefault();
      scrollToSection(id);
    }
  }

  return { currentFor, handleClick };
}
