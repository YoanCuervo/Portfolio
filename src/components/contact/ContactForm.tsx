import { type FormEvent, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./ContactForm.module.css";
import Field from "./Field";

const ENDPOINT = "https://api.web3forms.com/submit";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Values = { name: string; email: string; message: string };
type FieldName = keyof Values;
// The kind of error, not its text: the text is looked up at render time, so it
// follows a language switch.
type ErrorKind = "required" | "invalidEmail";
type Errors = Partial<Record<FieldName, ErrorKind>>;
type Status = "idle" | "sending" | "success" | "error";

const fieldNames: FieldName[] = ["name", "email", "message"];

function fieldError(field: FieldName, value: string): ErrorKind | undefined {
  if (value.trim() === "") {
    return "required";
  }
  if (field === "email" && !EMAIL_PATTERN.test(value.trim())) {
    return "invalidEmail";
  }
  return undefined;
}

export default function ContactForm() {
  const { t } = useLanguage();
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  // Hidden checkbox that only robots fill in (honeypot): Web3Forms ignores the
  // message when it is checked.
  const [botcheck, setBotcheck] = useState(false);
  const successRef = useRef<HTMLParagraphElement>(null);

  function handleChange(field: FieldName, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    // Once a field shows an error, it is checked again on every change, so the
    // message disappears as soon as the field is fixed.
    if (errors[field]) {
      setErrors((previous) => ({
        ...previous,
        [field]: fieldError(field, value),
      }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") {
      return;
    }

    const nextErrors: Errors = {};
    for (const field of fieldNames) {
      nextErrors[field] = fieldError(field, values[field]);
    }
    setErrors(nextErrors);
    const firstInvalid = fieldNames.find((field) => nextErrors[field]);
    if (firstInvalid) {
      // Moving the focus makes a screen reader read the field and its error.
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    // A robot ticked the hidden box: nothing is sent, but it sees a success so it
    // does not learn that it was spotted.
    if (botcheck) {
      setStatus("success");
      return;
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
    if (!accessKey) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ access_key: accessKey, ...values, botcheck }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStatus("success");
        // The form disappears: the focus moves to the confirmation instead of
        // being lost.
        requestAnimationFrame(() => successRef.current?.focus());
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const sending = status === "sending";

  return (
    <>
      {/* Always in the page, so screen readers announce its content when it appears. */}
      <div role="status" className={styles.statusRegion}>
        {status === "success" && (
          <p ref={successRef} tabIndex={-1} className={styles.success}>
            {t.contact.success}
          </p>
        )}
      </div>

      {status !== "success" && (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.frame}>
            <Field
              id="contact-name"
              name="name"
              label={t.contact.fields.name}
              type="text"
              autoComplete="name"
              value={values.name}
              error={errors.name && t.contact.errors[errors.name]}
              onChange={(value) => handleChange("name", value)}
            />
            <Field
              id="contact-email"
              name="email"
              label={t.contact.fields.email}
              type="email"
              autoComplete="email"
              value={values.email}
              error={errors.email && t.contact.errors[errors.email]}
              onChange={(value) => handleChange("email", value)}
            />
            <Field
              id="contact-message"
              name="message"
              label={t.contact.fields.message}
              type="textarea"
              value={values.message}
              error={errors.message && t.contact.errors[errors.message]}
              onChange={(value) => handleChange("message", value)}
            />
            <div aria-hidden="true" className={styles.honeypot}>
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                checked={botcheck}
                onChange={(event) => setBotcheck(event.target.checked)}
              />
            </div>
          </div>

          {status === "error" && (
            <p role="alert" className={styles.failure}>
              {t.contact.failure}
            </p>
          )}

          <button type="submit" className={styles.submit} disabled={sending}>
            {sending ? t.contact.sending : t.contact.submit}
          </button>
        </form>
      )}
    </>
  );
}
