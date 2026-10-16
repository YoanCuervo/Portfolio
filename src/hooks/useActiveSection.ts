import { useEffect, useState } from "react";
import { SECTION_NAVIGATE_EVENT } from "../utils/scrollToSection";

const SECTION_IDS = ["home", "skills", "projects", "about", "contact"];
// Safety net: the observer takes over again after this delay even if the browser
// never sends "scrollend" (for example when the visitor clicks the section they are on).
const NAVIGATION_LOCK_MS = 1500;

// Id of the section that crosses a reading line at 40 % of the screen height.
// The sections follow each other without overlapping, so only one crosses the
// line at a time: the active section changes once per boundary, without flicker.
// `enabled` is false outside the home page, where these sections do not exist.
export function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }

    // After a click in the Navbar, the target is active at once and the observer
    // waits for the end of the scroll: the smooth scroll would otherwise underline
    // every section it passes through.
    let locked = false;
    let unlockTimer = 0;

    function unlock() {
      locked = false;
      window.clearTimeout(unlockTimer);
    }

    function handleNavigate(event: Event) {
      setActive((event as CustomEvent<string>).detail);
      locked = true;
      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(unlock, NAVIGATION_LOCK_MS);
      window.addEventListener("scrollend", unlock, { once: true });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (locked) {
          return;
        }
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -59% 0px" },
    );

    for (const id of SECTION_IDS) {
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    }
    window.addEventListener(SECTION_NAVIGATE_EVENT, handleNavigate);

    return () => {
      observer.disconnect();
      unlock();
      window.removeEventListener(SECTION_NAVIGATE_EVENT, handleNavigate);
      window.removeEventListener("scrollend", unlock);
    };
  }, [enabled]);

  return active;
}
