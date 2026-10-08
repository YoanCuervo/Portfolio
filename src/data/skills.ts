import {
  type SimpleIcon,
  siBiome,
  siCss,
  siDocker,
  siExpress,
  siFigma,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siPython,
  siReact,
  siTypescript,
} from "simple-icons";
import type { en } from "../locales/en";

type RowId = keyof typeof en.skills.rows;
type TranslatedPill = keyof typeof en.skills.pills;

// A skill has either a name (a proper noun, never translated) or a translation key.
export type Skill =
  | { name: string; icon?: SimpleIcon }
  | { translation: TranslatedPill; icon?: SimpleIcon };

export type StackRow = {
  id: RowId;
  dashed: boolean;
  skills: Skill[];
};

export const stack: StackRow[] = [
  {
    id: "languages",
    dashed: false,
    skills: [
      { name: "JavaScript", icon: siJavascript },
      { name: "TypeScript", icon: siTypescript },
    ],
  },
  {
    id: "frontend",
    dashed: false,
    skills: [
      { name: "React", icon: siReact },
      { name: "Next.js", icon: siNextdotjs },
      { name: "HTML5", icon: siHtml5 },
      { name: "CSS3", icon: siCss },
    ],
  },
  {
    id: "backend",
    dashed: false,
    skills: [
      { name: "Node.js", icon: siNodedotjs },
      { name: "Express.js", icon: siExpress },
      { name: "MySQL", icon: siMysql },
      { translation: "restApi" },
    ],
  },
  {
    id: "tools",
    dashed: false,
    skills: [
      { name: "Git", icon: siGit },
      { name: "GitHub", icon: siGithub },
      { name: "Docker", icon: siDocker },
      { name: "Biome", icon: siBiome },
      { name: "Figma", icon: siFigma },
    ],
  },
  {
    id: "learning",
    dashed: true,
    skills: [
      { name: "Python", icon: siPython },
      { name: "CI/CD" },
      { name: "MLOps" },
      { name: "LLM" },
      { name: "RAG" },
      { translation: "agenticAi" },
    ],
  },
];
