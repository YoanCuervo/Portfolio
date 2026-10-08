import { useLanguage } from "../../context/LanguageContext";
import type { Client } from "../../data/clients";
import styles from "./ClientTile.module.css";

export default function ClientTile({ client }: { client: Client }) {
  const { t } = useLanguage();

  return (
    <li className={styles.tile}>
      {client.logo ? (
        <img
          src={client.logo}
          alt=""
          width={58}
          height={58}
          className={styles.logo}
        />
      ) : (
        <span className={styles.placeholder}>{t.about.logoPlaceholder}</span>
      )}
      <span className={styles.name}>{client.name}</span>
    </li>
  );
}
