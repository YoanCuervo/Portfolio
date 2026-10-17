import type { en } from "../locales/en";

export type SoftSkillId = keyof typeof en.about.softSkills;

// Ordered so that a 1920 px screen shows two even lines of four, then agile
// and debugging alone, in both languages.
export const softSkills: SoftSkillId[] = [
  "adaptability",
  "prioritization",
  "autonomy",
  "userUnderstanding",
  "analyticalThinking",
  "fastLearner",
  "initiative",
  "productCollaboration",
  "agile",
  "debugging",
];
