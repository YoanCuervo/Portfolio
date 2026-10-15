import { useEffect, useRef, useState } from "react";
import { SECTION_NAVIGATE_EVENT } from "../utils/scrollToSection";

// Becomes true the first time the element is at least 20 % on screen, then stops
// watching: the entrance animation plays once on scroll. When the Navbar takes the
// visitor to `sectionId`, it goes back to false and watches again, so the
// animation plays once more. T is the type of the element the ref is attached to.
export function useReveal<T extends Element>(sectionId: string) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);
  // Incremented on each Navbar visit: restarts the effect below.
  const [visit, setVisit] = useState(0);

  useEffect(() => {
    function handleNavigate(event: Event) {
      if ((event as CustomEvent<string>).detail === sectionId) {
        setRevealed(false);
        setVisit((count) => count + 1);
      }
    }
    window.addEventListener(SECTION_NAVIGATE_EVENT, handleNavigate);
    return () =>
      window.removeEventListener(SECTION_NAVIGATE_EVENT, handleNavigate);
  }, [sectionId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: visit is not read, it only restarts the observer after a Navbar visit
  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [visit]);

  return { ref, revealed };
}
