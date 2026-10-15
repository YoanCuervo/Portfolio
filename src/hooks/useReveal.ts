import { useEffect, useRef, useState } from "react";

// Becomes true the first time the element is at least 20 % on screen, then stops
// watching: an entrance animation plays only once. T is the type of the element
// the ref is attached to (div, ul…).
export function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

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
  }, []);

  return { ref, revealed };
}
