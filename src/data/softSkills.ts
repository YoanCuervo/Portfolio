import type { en } from "../locales/en";

export type SoftSkillId = keyof typeof en.about.softSkills;

// One array per line: three soft skills per line on desktop. On mobile the pills
// flow freely (About.module.css).
export const softSkillRows: SoftSkillId[][] = [
  ["adaptability", "prioritization", "productCollaboration"],
  ["fastLearner", "initiative", "analyticalThinking"],
  ["agile", "autonomy", "debugging"],
];
