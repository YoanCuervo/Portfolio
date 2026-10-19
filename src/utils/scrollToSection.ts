// Sent when the Navbar takes the visitor to a section: the section replays its
// entrance animation (useReveal, AnimatedRole).
export const SECTION_NAVIGATE_EVENT = "section-navigate";

// Without `behavior`, the scroll follows the CSS `scroll-behavior` (smooth).
export function scrollToSection(id: string, behavior?: ScrollBehavior) {
  window.dispatchEvent(
    new CustomEvent<string>(SECTION_NAVIGATE_EVENT, { detail: id }),
  );
  document.getElementById(id)?.scrollIntoView({ behavior });
}
