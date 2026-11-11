import type { CSSProperties } from "react";
import { useLanguage } from "../../context/LanguageContext";
import type { StackRow as StackRowData } from "../../data/skills";
import Pill from "../ui/Pill";
import styles from "./StackRow.module.css";

type StackRowProps = {
  row: StackRowData;
  index: number; // position in the entrance cascade
  revealed: boolean;
};

export default function StackRow({ row, index, revealed }: StackRowProps) {
  const { t } = useLanguage();

  return (
    <div
      className={revealed ? `${styles.row} ${styles.revealed}` : styles.row}
      style={{ "--i": index } as CSSProperties}
    >
      <h4 className={styles.label}>{t.skills.rows[row.id]}</h4>
      <ul className={styles.pills}>
        {row.skills.map((skill) => {
          const label =
            "translation" in skill
              ? t.skills.pills[skill.translation]
              : skill.name;
          return (
            <li key={label}>
              <Pill icon={skill.icon} dashed={row.dashed}>
                {label}
              </Pill>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
