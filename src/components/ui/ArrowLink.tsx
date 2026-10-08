import type { ReactNode } from "react";
import { siGithub } from "simple-icons";
import styles from "./ArrowLink.module.css";
import TechIcon from "./TechIcon";

type ArrowLinkProps = {
  href: string;
  children: ReactNode;
};

export default function ArrowLink({ href, children }: ArrowLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      <TechIcon icon={siGithub} size={16} />
      {children}
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </a>
  );
}
