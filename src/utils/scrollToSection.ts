// Sent when the Navbar takes the visitor to a section: the section replays its
// entrance animation (useReveal, AnimatedRole).
export const SECTION_NAVIGATE_EVENT = "section-navigate";

export function scrollToSection(id: string) {
  window.dispatchEvent(
    new CustomEvent<string>(SECTION_NAVIGATE_EVENT, { detail: id }),
  );
  document.getElementById(id)?.scrollIntoView();
}
