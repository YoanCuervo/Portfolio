import type { ReactNode } from "react";
import styles from "./IconLink.module.css";

type IconLinkProps = {
  label: string;
  size?: "md" | "lg";
  href?: string;
  onClick?: () => void;
  children: ReactNode;
};

// A link when it leads somewhere (href), a button when it triggers an action (onClick).
export default function IconLink({
  label,
  size = "md",
  href,
  onClick,
  children,
}: IconLinkProps) {
  const className = `${styles.round} ${styles[size]}`;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={className}
    >
      {children}
    </button>
  );
}
