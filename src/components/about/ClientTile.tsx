import type { Client } from "../../data/clients";
import styles from "./ClientTile.module.css";

type ClientTileProps = {
  client: Client;
  tooltipSide: "above" | "below";
};

// The name stays in the DOM: it is what screen readers announce, the logo
// itself has an empty alt.
export default function ClientTile({ client, tooltipSide }: ClientTileProps) {
  return (
    <li className={styles.tile}>
      {client.logo ? (
        <>
          <img
            src={client.logo}
            alt=""
            width={120}
            height={56}
            className={styles.logo}
          />
          <span className={`${styles.tooltip} ${styles[tooltipSide]}`}>
            {client.name}
          </span>
        </>
      ) : (
        <span className={styles.fallback}>{client.name}</span>
      )}
    </li>
  );
}
