import atroposIllustration from "../assets/projects/atropos.jpg";
import pokeGachaTest from "../assets/projects/poke-gacha-test.jpg";
import wegatherScreenshot from "../assets/projects/wegather.jpg";
import type { en } from "../locales/en";

export type Project = {
  id: keyof typeof en.projects.items;
  title: string; // proper noun, never translated
  stack: string[];
  team: keyof typeof en.projects.team | null; // null = not provided yet (T20)
  liveUrl: string | null;
  repoUrl: string | null;
  // A version taken over and put online by another developer, from their own repo.
  deployed: { name: string; author: string; repoUrl: string } | null;
  screenshot: string | null; // image import
  featured: boolean; // true = shown on the home page (3 at most)
};

export const projects: Project[] = [
  {
    id: "atropos",
    title: "Atropos",
    stack: ["Electron", "React", "JavaScript", "SQLite"],
    team: "solo",
    liveUrl: "https://yoancuervo.github.io/Atropos/",
    repoUrl: "https://github.com/YoanCuervo/Atropos",
    deployed: null,
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
    deployed: null,
    screenshot: pokeGachaTest,
    featured: true,
  },
  {
    id: "wedoo",
    title: "Wedoo",
    stack: ["React", "TypeScript", "Node.js", "Express", "MySQL"],
    team: "team",
    liveUrl: "https://wegather.fr/",
    repoUrl: "https://github.com/YoanCuervo/WEDOO",
    deployed: {
      name: "weGather",
      author: "Laurent Farvacque",
      repoUrl: "https://github.com/FARVACQUE-L/WeGather",
    },
    screenshot: wegatherScreenshot,
    featured: true,
  },
  {
    id: "project4",
    title: "[Project 4]",
    stack: [],
    team: null,
    liveUrl: null,
    repoUrl: null,
    deployed: null,
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
    deployed: null,
    screenshot: null,
    featured: false,
  },
];
