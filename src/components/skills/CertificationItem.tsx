import type { CSSProperties } from "react";
import { useLanguage } from "../../context/LanguageContext";
import type { Certification } from "../../data/certifications";
import Tag from "../ui/Tag";
import styles from "./CertificationItem.module.css";

type CertificationItemProps = {
  certification: Certification;
  index: number; // position in the entrance cascade
  revealed: boolean;
};

export default function CertificationItem({
  certification,
  index,
  revealed,
}: CertificationItemProps) {
  const { t } = useLanguage();
  const text = t.skills.certifications[certification.id];

  return (
    <div
      className={revealed ? `${styles.item} ${styles.revealed}` : styles.item}
      style={{ "--i": index } as CSSProperties}
    >
      <h4 className={styles.title}>{text.title}</h4>
      <p className={styles.detail}>{text.detail}</p>
      <div>
        <Tag dashed={certification.inProgress}>{text.status}</Tag>
      </div>
    </div>
  );
}
