import type { CSSProperties } from "react";
import styles from "./BlurDecor.module.css";

type BlurDecorProps = {
  color: "amber" | "rose" | "gold";
  size: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  opacity: [dark: number, light: number];
};

function px(value: number | undefined) {
  return value === undefined ? "auto" : `${value}px`;
}

export default function BlurDecor({
  color,
  size,
  top,
  right,
  bottom,
  left,
  opacity,
}: BlurDecorProps) {
  // CSSProperties does not know custom properties, hence the cast.
  const style = {
    "--size": `${size}px`,
    "--top": px(top),
    "--right": px(right),
    "--bottom": px(bottom),
    "--left": px(left),
    "--opacity-dark": opacity[0],
    "--opacity-light": opacity[1],
  } as CSSProperties;

  return (
    <div
      aria-hidden="true"
      className={`${styles.halo} ${styles[color]}`}
      style={style}
    />
  );
}
