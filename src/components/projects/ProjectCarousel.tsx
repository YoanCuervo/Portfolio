import { type MouseEvent, type PointerEvent, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import type { Project } from "../../data/projects";
import { useReveal } from "../../hooks/useReveal";
import IconLink from "../ui/IconLink";
import FeaturedProjectCard from "./FeaturedProjectCard";
import styles from "./ProjectCarousel.module.css";

type ProjectCarouselProps = {
  projects: Project[];
};

const iconProps = {
  viewBox: "0 0 24 24",
  width: 20,
  height: 20,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const previousIcon = (
  <svg {...iconProps} aria-hidden="true">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const nextIcon = (
  <svg {...iconProps} aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// Horizontal distance, in px, a finger must travel for a swipe to change the card.
const SWIPE_THRESHOLD = 40;

// Mobile replacement for the three-card grid: the active card in the centre, the
// two others behind it on each side. The cards are stacked in one grid cell and
// only their position class changes, so the CSS transition slides them into place.
export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const swipeStartX = useRef<number | null>(null);
  // The whole card is a link: the click that ends a swipe must not open it.
  const swiped = useRef(false);
  // The carousel enters as a whole: the desktop fan of the cards doesn't exist on mobile.
  const { ref, revealed } = useReveal<HTMLElement>("projects");

  // The modulo makes the navigation loop: after the last card, the first one.
  function goTo(index: number) {
    setActive((index + projects.length) % projects.length);
  }

  // With three projects, the card after the active one goes on the right and the
  // remaining one on the left, whatever the active card: the loop has no end.
  function positionOf(index: number) {
    const offset = (index - active + projects.length) % projects.length;
    if (offset === 0) {
      return styles.center;
    }
    return offset === 1 ? styles.right : styles.left;
  }

  function handlePointerDown(event: PointerEvent) {
    swipeStartX.current = event.clientX;
    // A touch swipe may end without a click: the flag must not cancel the next tap.
    swiped.current = false;
  }

  function handlePointerUp(event: PointerEvent) {
    if (swipeStartX.current === null) {
      return;
    }
    const distance = event.clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (Math.abs(distance) > SWIPE_THRESHOLD) {
      swiped.current = true;
      // Swiping to the left brings the next card, like turning a page.
      goTo(distance < 0 ? active + 1 : active - 1);
    }
  }

  // Runs before the card link's own click (capture phase): a cancelled click
  // does not navigate.
  function handleClickCapture(event: MouseEvent) {
    if (swiped.current) {
      event.preventDefault();
    }
  }

  // The browser took over the gesture (vertical page scroll): no swipe.
  function handlePointerCancel() {
    swipeStartX.current = null;
  }

  return (
    // A named <section> is exposed as a "region" landmark: no role attribute needed.
    <section
      ref={ref}
      aria-roledescription={t.projects.carousel.roleDescription}
      aria-label={t.projects.title}
      className={
        revealed ? `${styles.carousel} ${styles.revealed}` : styles.carousel
      }
    >
      <div
        className={styles.stage}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClickCapture={handleClickCapture}
      >
        {projects.map((project, index) => (
          // The background cards are inert: Tab, touch and screen readers skip them.
          <div
            key={project.id}
            className={`${styles.slide} ${positionOf(index)}`}
            inert={index !== active}
          >
            <FeaturedProjectCard project={project} index={index} />
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <IconLink
          label={t.projects.carousel.previous}
          onClick={() => goTo(active - 1)}
        >
          {previousIcon}
        </IconLink>

        <div className={styles.position}>
          <div className={styles.dots}>
            {projects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                aria-label={`${t.projects.carousel.goTo} ${index + 1}`}
                aria-current={index === active ? "true" : undefined}
                className={styles.dot}
                onClick={() => goTo(index)}
              >
                <span className={styles.dotMark} />
              </button>
            ))}
          </div>
          <p aria-live="polite" className={styles.counter}>
            {active + 1} / {projects.length}
          </p>
        </div>

        <IconLink
          label={t.projects.carousel.next}
          onClick={() => goTo(active + 1)}
        >
          {nextIcon}
        </IconLink>
      </div>
    </section>
  );
}
