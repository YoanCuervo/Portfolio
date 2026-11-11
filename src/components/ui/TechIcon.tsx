import type { SimpleIcon } from "simple-icons";

type TechIconProps = {
  icon: SimpleIcon;
  size: number;
  className?: string;
};

// The color comes from the parent through currentColor.
export default function TechIcon({ icon, size, className }: TechIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d={icon.path} />
    </svg>
  );
}
