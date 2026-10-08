import type { Client } from "../../data/clients";
import ClientTile from "./ClientTile";
import styles from "./Marquee.module.css";

type MarqueeProps = {
  clients: Client[];
  direction: "left" | "right";
};

// The list is rendered twice: when the track has moved by half its width, the
// second copy sits exactly where the first one started, so the loop is seamless.
// The copy is hidden from screen readers.
export default function Marquee({ clients, direction }: MarqueeProps) {
  const tiles = clients.map((client) => (
    <ClientTile key={client.name} client={client} />
  ));

  return (
    <div className={styles.marquee}>
      <div className={`${styles.track} ${styles[direction]}`}>
        <ul className={styles.list}>{tiles}</ul>
        <ul className={styles.list} aria-hidden="true">
          {tiles}
        </ul>
      </div>
    </div>
  );
}
