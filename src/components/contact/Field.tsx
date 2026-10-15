import styles from "./Field.module.css";

type FieldProps = {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "textarea";
  autoComplete?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

export default function Field({
  id,
  name,
  label,
  type,
  autoComplete,
  value,
  error,
  onChange,
}: FieldProps) {
  const errorId = `${id}-error`;
  // Linked to its error message so a screen reader reads it with the field.
  const errorProps = {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  };

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
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${styles.control} ${styles.textarea}`}
          {...errorProps}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${styles.control} ${styles.input}`}
          {...errorProps}
        />
      )}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
