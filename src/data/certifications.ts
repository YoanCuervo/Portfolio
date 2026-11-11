import type { en } from "../locales/en";

export type Certification = {
  id: keyof typeof en.skills.certifications;
  inProgress: boolean;
};

export const certifications: Certification[] = [
  { id: "webMobile", inProgress: false },
  { id: "aiDeveloper", inProgress: true },
];
