import type { FormEvent } from "react";
import { useLanguage } from "../../context/LanguageContext";
import styles from "./ContactForm.module.css";
import Field from "./Field";

export default function ContactForm() {
  const { t } = useLanguage();

  // Until T13 wires the sending: without this, the browser would reload the page
  // and put the name, email and message in the address bar.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.frame}>
        <Field
          id="contact-name"
          name="name"
          label={t.contact.fields.name}
          type="text"
          autoComplete="name"
        />
        <Field
          id="contact-email"
          name="email"
          label={t.contact.fields.email}
          type="email"
          autoComplete="email"
        />
        <Field
          id="contact-message"
          name="message"
          label={t.contact.fields.message}
          type="textarea"
        />
      </div>
      <button type="submit" className={styles.submit}>
        {t.contact.submit}
      </button>
    </form>
  );
}
