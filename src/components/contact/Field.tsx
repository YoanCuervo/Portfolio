import styles from "./Field.module.css";

type FieldProps = {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "textarea";
  autoComplete?: string;
};

export default function Field({
  id,
  name,
  label,
  type,
  autoComplete,
}: FieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          rows={6}
          required
          className={`${styles.control} ${styles.textarea}`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required
          className={`${styles.control} ${styles.input}`}
        />
      )}
    </div>
  );
}
