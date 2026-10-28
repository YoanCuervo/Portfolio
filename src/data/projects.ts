import atroposIllustration from "../assets/projects/atropos.jpg";
import pokeGachaTest from "../assets/projects/poke-gacha-test.jpg";
import type { en } from "../locales/en";

export type Project = {
  id: keyof typeof en.projects.items;
  title: string; // proper noun, never translated
  stack: string[];
  team: keyof typeof en.projects.team | null; // null = not provided yet (T20)
  liveUrl: string | null;
  repoUrl: string | null;
  screenshot: string | null; // image import
  featured: boolean; // true = shown on the home page (3 at most)
};

export const projects: Project[] = [
  {
    id: "atropos",
    title: "Atropos",
    stack: ["Electron", "React", "JavaScript", "SQLite"],
    team: "solo",
    liveUrl: null,
    repoUrl: "https://github.com/YoanCuervo/Atropos",
    screenshot: atroposIllustration,
    featured: true,
  },
  {
    id: "pokeGacha",
    title: "Poke_Gacha",
    stack: ["React", "TypeScript", "Express", "MySQL"],
    team: "solo",
    liveUrl: null,
    repoUrl: "https://github.com/YoanCuervo/Pokemon_Gacha_BACKEND",
    screenshot: pokeGachaTest,
    featured: true,
  },
  {
    id: "wedoo",
    title: "Wedoo",
    stack: ["React", "TypeScript", "Node.js", "Express", "MySQL"],
    team: "team",
    liveUrl: null,
    repoUrl: "https://github.com/YoanCuervo/WEDOO",
    screenshot: null,
    featured: true,
  },
  {
    id: "project4",
    title: "[Project 4]",
    stack: [],
    team: null,
    liveUrl: null,
    repoUrl: null,
    screenshot: null,
    featured: false,
  },
  {
    id: "project5",
    title: "[Project 5]",
    stack: [],
    team: null,
    liveUrl: null,
    repoUrl: null,
    screenshot: null,
    featured: false,
  },
];
