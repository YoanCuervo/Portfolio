import type { en } from "../locales/en";

export type SoftSkillId = keyof typeof en.about.softSkills;

export const softSkills: SoftSkillId[] = [
  "adaptability",
  "analyticalThinking",
  "prioritization",
  "debugging",
  "fastLearner",
  "initiative",
  "agile",
  "autonomy",
  "productCollaboration",
  "userUnderstanding",
];
