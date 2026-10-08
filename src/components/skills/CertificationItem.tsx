import { useLanguage } from "../../context/LanguageContext";
import type { Certification } from "../../data/certifications";
import Tag from "../ui/Tag";
import styles from "./CertificationItem.module.css";

export default function CertificationItem({
  certification,
}: {
  certification: Certification;
}) {
  const { t } = useLanguage();
  const text = t.skills.certifications[certification.id];

  return (
    <div className={styles.item}>
      <h4 className={styles.title}>{text.title}</h4>
      <p className={styles.detail}>{text.detail}</p>
      <div>
        <Tag dashed={certification.inProgress}>{text.status}</Tag>
      </div>
    </div>
  );
}
