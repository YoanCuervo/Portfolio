import { useLanguage } from "../../context/LanguageContext";
import type { StackRow as StackRowData } from "../../data/skills";
import Pill from "../ui/Pill";
import styles from "./StackRow.module.css";

export default function StackRow({ row }: { row: StackRowData }) {
  const { t } = useLanguage();

  return (
    <div className={styles.row}>
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
